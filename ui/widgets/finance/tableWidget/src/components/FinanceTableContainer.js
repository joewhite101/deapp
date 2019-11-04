import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import FinanceTable from 'components/FinanceTable';
import financesGet from 'api/finances';
import Notification from 'components/common/Notification';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

export default class FinanceTableContainer extends PureComponent {
  theme = createMuiTheme();

  state = {
      finances: [],
      notificationStatus: null,
      notificationMessage: null,
  };

  async componentDidMount() {
    try {
      const json = await financesGet();

      const finances = json.map(finance => ({
        ...finance,
      }));
      this.setState({
        finances,
        notificationStatus: null,
        notificationMessage: null,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  closeNotification = () => {
    this.setState({error: null});
  };

  handleError(err) {
    const {onError} = this.props;
    onError(err);
    this.setState({
      notificationStatus: 'error',
      notificationMessage: i18next.t('common.couldNotFetchData'),
    });
  }

  render() {
    const {notificationStatus, notificationMessage, finances} = this.state;
    const {onSelect} = this.props;
    return (
      <ThemeProvider theme={this.theme}>
        <FinanceTable finances={finances} onSelect={onSelect}/>
        <Notification
          status={notificationStatus}
          message={notificationMessage}
          onClose={this.closeNotification}
        />
      </ThemeProvider>
    );
  }
}

FinanceTableContainer.propTypes = {
  onError: PropTypes.func,
  onSelect: PropTypes.func,
};

FinanceTableContainer.defaultProps = {
  onError: () => {
  },
  onSelect: () => {
  },
};
