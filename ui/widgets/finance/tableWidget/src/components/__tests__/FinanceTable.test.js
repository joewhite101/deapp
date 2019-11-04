import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18nMock';
import financeMocks from 'components/__mocks__/financeMocks';
import FinanceTable from 'components/FinanceTable';

describe('FinanceTable', () => {
  it('shows finances', () => {
    const { getByText } = render(<FinanceTable finances={financeMocks} />);
    expect(getByText('Ea eum numquam molestiae adipisci sunt sunt. Velit ut sed neque quia qui officiis fugiat neque. Et tempore alias facilis ullam. Fugit harum quia incidunt sit dicta. Eveniet tempora placeat est praesentium ad.')).toBeInTheDocument();
    expect(getByText('Assumenda quia ut excepturi quidem ex autem. Consequuntur fugiat nostrum et ab facilis nihil. Atque reiciendis mollitia tenetur sed magni et qui. Quasi tempore ut dolores. Officiis nobis odio tempore quibusdam ullam excepturi et voluptate rerum.')).toBeInTheDocument();
  });

  it('shows no finances message', () => {
    const { queryByText } = render(<FinanceTable finances={[]} />);
    expect(queryByText('Ea eum numquam molestiae adipisci sunt sunt. Velit ut sed neque quia qui officiis fugiat neque. Et tempore alias facilis ullam. Fugit harum quia incidunt sit dicta. Eveniet tempora placeat est praesentium ad.')).not.toBeInTheDocument();
    expect(queryByText('Assumenda quia ut excepturi quidem ex autem. Consequuntur fugiat nostrum et ab facilis nihil. Atque reiciendis mollitia tenetur sed magni et qui. Quasi tempore ut dolores. Officiis nobis odio tempore quibusdam ullam excepturi et voluptate rerum.')).not.toBeInTheDocument();

    expect(queryByText('entities.finance.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <FinanceTable finances={financeMocks} onSelect={onSelectMock} />
    );
    fireEvent.click(getByText('Ea eum numquam molestiae adipisci sunt sunt. Velit ut sed neque quia qui officiis fugiat neque. Et tempore alias facilis ullam. Fugit harum quia incidunt sit dicta. Eveniet tempora placeat est praesentium ad.'));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
