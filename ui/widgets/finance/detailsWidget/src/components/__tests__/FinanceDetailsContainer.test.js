import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import getFinance from 'api/finance';
import financeApiGetResponseMock from 'components/__mocks__/financeMocks';
import FinanceDetailsContainer from 'components/FinanceDetailsContainer';

jest.mock('api/finance');

beforeEach(() => {
  getFinance.mockClear();
});

describe('FinanceDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    getFinance.mockImplementation(() => Promise.resolve(financeApiGetResponseMock));

    render(<FinanceDetailsContainer id="1" />);

    await wait(() => {
      expect(getFinance).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    getFinance.mockImplementation(() => Promise.resolve(financeApiGetResponseMock));

    const { getByText } = render(<FinanceDetailsContainer id="1" />);

    await wait(() => {
      expect(getFinance).toHaveBeenCalledTimes(1);
      expect(getByText('entities.finance.name')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    getFinance.mockImplementation(() => Promise.reject());

    const { getByText } = render(<FinanceDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(getFinance).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
