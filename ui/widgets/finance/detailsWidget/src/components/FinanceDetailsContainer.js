import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

import FinanceDetails from 'components/FinanceDetails';
import Notification from 'components/common/Notification';
import getFinance from 'api/finance';

class FinanceDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      finance: {},
      notificationStatus: null,
      notificationMessage: null,
    };

    this.theme = createMuiTheme();
    this.closeNotification = this.closeNotification.bind(this);
  }

  componentDidMount() {
    const { id, onError } = this.props;

    if (id) {
      getFinance({ id })
        .then(response => this.setState({
          notificationStatus: null,
          notificationMessage: null,
          finance: response
        }))
        .catch(e => {
          onError(e);
          this.setState({
            notificationStatus: 'error',
            notificationMessage: i18next.t('common.couldNotFetchData'),
          });
        })
        .finally(() => this.setState({ loading: false }));
    } else {
      this.setState({
        loading: false,
        notificationStatus: 'error',
        notificationMessage: i18next.t('common.missingId'),
      });
    }
  }

  closeNotification() {
    this.setState({ error: null });
  }

  render() {
    const { finance, notificationStatus, notificationMessage, loading } = this.state;

    return (
      <ThemeProvider theme={this.theme}>
        {loading && i18next.t('common.loading')}
        {!loading && <FinanceDetails finance={finance} />}
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </ThemeProvider>
    );
  }
}

FinanceDetailsContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

FinanceDetailsContainer.defaultProps = {
  onError: () => {},
};

export default FinanceDetailsContainer;
