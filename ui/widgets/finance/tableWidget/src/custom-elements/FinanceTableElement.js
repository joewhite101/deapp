import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import FinanceTableContainer from 'components/FinanceTableContainer';

class FinanceTableElement extends HTMLElement
{
  connectedCallback()
  {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const customEventPrefix = 'Finance.table.';

    const onError = error => {
      const customEvent = new CustomEvent(`${customEventPrefix}error`, {
        detail: {
          error,
        },
      });
      this.dispatchEvent(customEvent);
    };

    const onSelect = item => {
      const customEvent = new CustomEvent(`${customEventPrefix}select`, {
        detail: {
          item,
        },
      });
      this.dispatchEvent(customEvent);
    };

    const reactRoot = React.createElement(FinanceTableContainer, {onError, onSelect}, null);
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('finance-table', FinanceTableElement);
