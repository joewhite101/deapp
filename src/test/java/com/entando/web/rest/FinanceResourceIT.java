package com.entando.web.rest;

import com.entando.DeappApp;
import com.entando.config.TestSecurityConfiguration;
import com.entando.domain.Finance;
import com.entando.repository.FinanceRepository;
import com.entando.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.entando.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link FinanceResource} REST controller.
 */
@SpringBootTest(classes = {DeappApp.class, TestSecurityConfiguration.class})
public class FinanceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private FinanceRepository financeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restFinanceMockMvc;

    private Finance finance;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FinanceResource financeResource = new FinanceResource(financeRepository);
        this.restFinanceMockMvc = MockMvcBuilders.standaloneSetup(financeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Finance createEntity(EntityManager em) {
        Finance finance = new Finance()
            .name(DEFAULT_NAME);
        return finance;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Finance createUpdatedEntity(EntityManager em) {
        Finance finance = new Finance()
            .name(UPDATED_NAME);
        return finance;
    }

    @BeforeEach
    public void initTest() {
        finance = createEntity(em);
    }

    @Test
    @Transactional
    public void createFinance() throws Exception {
        int databaseSizeBeforeCreate = financeRepository.findAll().size();

        // Create the Finance
        restFinanceMockMvc.perform(post("/api/finances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isCreated());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeCreate + 1);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createFinanceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = financeRepository.findAll().size();

        // Create the Finance with an existing ID
        finance.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinanceMockMvc.perform(post("/api/finances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllFinances() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        // Get all the financeList
        restFinanceMockMvc.perform(get("/api/finances?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finance.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        // Get the finance
        restFinanceMockMvc.perform(get("/api/finances/{id}", finance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(finance.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    public void getNonExistingFinance() throws Exception {
        // Get the finance
        restFinanceMockMvc.perform(get("/api/finances/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeUpdate = financeRepository.findAll().size();

        // Update the finance
        Finance updatedFinance = financeRepository.findById(finance.getId()).get();
        // Disconnect from session so that the updates on updatedFinance are not directly saved in db
        em.detach(updatedFinance);
        updatedFinance
            .name(UPDATED_NAME);

        restFinanceMockMvc.perform(put("/api/finances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFinance)))
            .andExpect(status().isOk());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();

        // Create the Finance

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinanceMockMvc.perform(put("/api/finances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeDelete = financeRepository.findAll().size();

        // Delete the finance
        restFinanceMockMvc.perform(delete("/api/finances/{id}", finance.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Finance.class);
        Finance finance1 = new Finance();
        finance1.setId(1L);
        Finance finance2 = new Finance();
        finance2.setId(finance1.getId());
        assertThat(finance1).isEqualTo(finance2);
        finance2.setId(2L);
        assertThat(finance1).isNotEqualTo(finance2);
        finance1.setId(null);
        assertThat(finance1).isNotEqualTo(finance2);
    }
}
