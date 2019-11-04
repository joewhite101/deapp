import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import i18next from 'i18next';
import { apiFinancePost } from 'api/finances';
import FinanceForm from 'components/FinanceForm';
import Notification from 'components/common/Notification';

class FinanceAddFormContainer extends PureComponent {
  theme = createMuiTheme();

  state = {
    notificationMessage: null,
  };

  constructor(props) {
    super(props);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeNotification() {
    this.setState({ notificationMessage: null, notificationStatus: null });
  }

  async handleSubmit(finance) {
    try {
      const createdFinance = await apiFinancePost(finance);
      const { onCreate } = this.props;
      onCreate(createdFinance);

      this.setState({
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
    const { notificationMessage, notificationStatus } = this.state;
    return (
      <ThemeProvider theme={this.theme}>
        <FinanceForm onSubmit={this.handleSubmit} />
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </ThemeProvider>
    );
  }
}

FinanceAddFormContainer.propTypes = {
  onError: PropTypes.func,
  onCreate: PropTypes.func,
};

FinanceAddFormContainer.defaultProps = {
  onError: () => {},
  onCreate: () => {},
};

export default FinanceAddFormContainer;
