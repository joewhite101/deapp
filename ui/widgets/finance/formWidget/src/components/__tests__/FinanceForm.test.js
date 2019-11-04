import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import 'components/__mocks__/i18nMock';
import financeMock from 'components/__mocks__/financeMocks';
// import { mockConferenceWithDateStrings } from 'components/__mocks__/conferenceMocks';
import FinanceForm from 'components/FinanceForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Conference Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <FinanceForm finance={financeMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.finance.name').value).toBe(
      'Ea eum numquam molestiae adipisci sunt sunt. Velit ut sed neque quia qui officiis fugiat neque. Et tempore alias facilis ullam. Fugit harum quia incidunt sit dicta. Eveniet tempora placeat est praesentium ad.'
    );
  });
});
