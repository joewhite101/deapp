import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import FinanceForm from 'components/FinanceForm';
import Notification from 'components/common/Notification';
import { apiFinanceGet, apiFinancePut } from 'api/finances';

class FinanceEditFormContainer extends PureComponent {
  theme = createMuiTheme();

  state = {
    finance: null,
    notificationMessage: null,
  };

  constructor(props) {
    super(props);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props;
    if (!id) return;
    try {
      const finance = await apiFinanceGet(id);
      this.setState({
        finance,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  closeNotification() {
    this.setState({ notificationMessage: null, notificationStatus: null });
  }

  async handleSubmit(finance) {
    try {
      const updatedFinance = await apiFinancePut(finance);
      const { onUpdate } = this.props;
      onUpdate(updatedFinance);

      this.setState({
        finance: updatedFinance,
        notificationMessage: i18next.t('common.dataSaved'),
        notificationStatus: 'success',
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
    this.setState({
      notificationMessage: i18next.t('errors.dataLoading'),
      notificationStatus: 'error',
    });
  }

  render() {
    const { notificationMessage, notificationStatus, finance } = this.state;
    return (
      <ThemeProvider theme={this.theme}>
        <FinanceForm
          finance={finance}
          onSubmit={this.handleSubmit}
        />
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </ThemeProvider>
    );
  }
}

FinanceEditFormContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onError: PropTypes.func,
  onUpdate: PropTypes.func,
};

FinanceEditFormContainer.defaultProps = {
  onError: () => {},
  onUpdate: () => {},
};

export default FinanceEditFormContainer;
