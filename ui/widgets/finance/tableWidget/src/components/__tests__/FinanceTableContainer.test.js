import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import financeMocks from 'components/__mocks__/financeMocks';
import financesGet from 'api/finances';
import 'components/__mocks__/i18nMock';
import FinanceTableContainer from 'components/FinanceTableContainer';

jest.mock('api/finances');

describe('FinanceTableContainer', () => {
    const errorMessageKey = 'common.couldNotFetchData';

    it('calls API', async () => {
        financesGet.mockImplementation(() => Promise.resolve(financeMocks));
        const { queryByText } = render(<FinanceTableContainer />);

        await wait(() => {
            expect(financesGet).toHaveBeenCalledTimes(1);
            expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
        });
    });

    it('shows an error if the API call is not successful', async () => {
        const onErrorMock = jest.fn();
        financesGet.mockImplementation(() => Promise.reject());
        const { getByText } = render(<FinanceTableContainer onError={onErrorMock} />);

        await wait(() => {
            expect(onErrorMock).toHaveBeenCalledTimes(1);
            expect(getByText(errorMessageKey)).toBeInTheDocument();
        });
    });
});
