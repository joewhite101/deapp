import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import financeType from 'components/__types__/finance';

const styles = {
    root: {
        cursor: 'pointer',
    },
};

const FinanceTable = ({ classes, finances, onSelect }) => {
    const tableRows = finances.map(finance => (
        <TableRow
            hover
            className={classes.root}
            key={finance.id}
            onClick={() => onSelect(finance)}
        >
            <TableCell><span>{finance.name}</span></TableCell>
        </TableRow>
    ));

    return (finances.length ? (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <span>{ i18next.t('entities.finance.name') }</span>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { tableRows }
            </TableBody>
        </Table>
    ) : (
        i18next.t("entities.finance.noItems")
    ));
};

FinanceTable.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string,
    }),
    finances: financeType,
    onSelect: PropTypes.func,
};

FinanceTable.defaultProps = {
    classes: {
        root: '',
    },
    onSelect: () => {},
};

export default withStyles(styles)(FinanceTable);
