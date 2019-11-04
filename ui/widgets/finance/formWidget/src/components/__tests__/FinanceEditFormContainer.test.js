import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiFinanceGet, apiFinancePut } from 'api/finances';
import FinanceEditFormContainer from 'components/FinanceEditFormContainer';
import 'components/__mocks__/i18nMock';
import financeMock from 'components/__mocks__/financeMocks';

jest.mock('api/finances');

describe('ConferenceEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'errors.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiFinanceGet.mockImplementation(() => Promise.resolve(financeMock));
    const { queryByText } = render(
      <FinanceEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiFinanceGet).toHaveBeenCalledTimes(1);
      expect(apiFinanceGet).toHaveBeenCalledWith('1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  });

  it('saves data', async () => {
    apiFinanceGet.mockImplementation(() => Promise.resolve(financeMock));
    apiFinancePut.mockImplementation(() => Promise.resolve(financeMock));

    const { findByTestId, queryByText } = render(
      <FinanceEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiFinancePut).toHaveBeenCalledTimes(1);
      expect(apiFinancePut).toHaveBeenCalledWith(financeMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if data is not successfully loaded', async () => {
    apiFinanceGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <FinanceEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiFinanceGet).toHaveBeenCalledTimes(1);
      expect(apiFinanceGet).toHaveBeenCalledWith('1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if data is not successfully saved', async () => {
    apiFinanceGet.mockImplementation(() => Promise.resolve(financeMock));
    apiFinancePut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <FinanceEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiFinanceGet).toHaveBeenCalledTimes(1);
      expect(apiFinanceGet).toHaveBeenCalledWith('1');

      expect(apiFinancePut).toHaveBeenCalledTimes(1);
      expect(apiFinancePut).toHaveBeenCalledWith(financeMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
