import React from 'react';
import i18next from 'i18next';
import Box from '@material-ui/core/Box';

import financeType from 'components/__types__/finance';
import FinanceFieldTable from 'components/finance-field-table/FinanceFieldTable';

const FinanceDetails = ({ finance }) => {
  return (
    <Box>
      <h3>
        {i18next.t('common.widgetName', {
          widgetNamePlaceholder: 'Finance',
        })}
      </h3>
      <FinanceFieldTable finance={finance} />
    </Box>
  );
};

FinanceDetails.propTypes = {
  finance: financeType,
};

FinanceDetails.defaultProps = {
  finance: {},
};

export default FinanceDetails;
