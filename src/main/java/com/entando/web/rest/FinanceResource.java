package com.entando.web.rest;

import com.entando.domain.Finance;
import com.entando.repository.FinanceRepository;
import com.entando.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.entando.domain.Finance}.
 */
@RestController
@RequestMapping("/api")
public class FinanceResource {

    private final Logger log = LoggerFactory.getLogger(FinanceResource.class);

    private static final String ENTITY_NAME = "deappFinance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinanceRepository financeRepository;

    public FinanceResource(FinanceRepository financeRepository) {
        this.financeRepository = financeRepository;
    }

    /**
     * {@code POST  /finances} : Create a new finance.
     *
     * @param finance the finance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new finance, or with status {@code 400 (Bad Request)} if the finance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/finances")
    public ResponseEntity<Finance> createFinance(@RequestBody Finance finance) throws URISyntaxException {
        log.debug("REST request to save Finance : {}", finance);
        if (finance.getId() != null) {
            throw new BadRequestAlertException("A new finance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Finance result = financeRepository.save(finance);
        return ResponseEntity.created(new URI("/api/finances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /finances} : Updates an existing finance.
     *
     * @param finance the finance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finance,
     * or with status {@code 400 (Bad Request)} if the finance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the finance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/finances")
    public ResponseEntity<Finance> updateFinance(@RequestBody Finance finance) throws URISyntaxException {
        log.debug("REST request to update Finance : {}", finance);
        if (finance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Finance result = financeRepository.save(finance);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finance.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /finances} : get all the finances.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of finances in body.
     */
    @GetMapping("/finances")
    public List<Finance> getAllFinances() {
        log.debug("REST request to get all Finances");
        return financeRepository.findAll();
    }

    /**
     * {@code GET  /finances/:id} : get the "id" finance.
     *
     * @param id the id of the finance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the finance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/finances/{id}")
    public ResponseEntity<Finance> getFinance(@PathVariable Long id) {
        log.debug("REST request to get Finance : {}", id);
        Optional<Finance> finance = financeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(finance);
    }

    /**
     * {@code DELETE  /finances/:id} : delete the "id" finance.
     *
     * @param id the id of the finance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/finances/{id}")
    public ResponseEntity<Void> deleteFinance(@PathVariable Long id) {
        log.debug("REST request to delete Finance : {}", id);
        financeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
