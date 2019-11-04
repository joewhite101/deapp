
import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import financeType from 'components/__types__/finance';

const FinanceFieldTable = ({ t, i18n: { language }, finance }) => {
  const translationKeyPrefix = `entities.finance.`;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('common.name')}</TableCell>
          <TableCell>{t('common.value')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <span>{t(`${translationKeyPrefix}id`)}</span>
          </TableCell>
          <TableCell>
            <span>{finance.id}</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <span>{t(`${translationKeyPrefix}name`)}</span>
          </TableCell>
          <TableCell>
            <span>{finance.name}</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

FinanceFieldTable.propTypes = {
  finance: financeType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

FinanceFieldTable.defaultProps = {
  finance: [],
};

export default withTranslation()(FinanceFieldTable);
