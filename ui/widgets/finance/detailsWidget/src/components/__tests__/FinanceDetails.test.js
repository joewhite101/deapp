import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import FinanceDetails from 'components/FinanceDetails';
import financeMock from 'components/__mocks__/financeMocks';
describe('FinanceDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<FinanceDetails finance={financeMock} />);
    
    expect(getByText('0')).toBeInTheDocument();
  });
});
