import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import YearFilter from './YearFilter';

describe('YearFilter', () => {
  it('renders all population years', () => {
    render(<YearFilter selectedYears={[2018]} onChange={() => {}} />);

    expect(screen.getByText('2002')).toBeInTheDocument();
    expect(screen.getByText('2018')).toBeInTheDocument();
  });

  it('calls onChange when year is toggled off', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearFilter selectedYears={[2017, 2018]} onChange={onChange} />);

    const checkbox2018 = screen.getByRole('checkbox', { name: '2018' });
    await user.click(checkbox2018);

    expect(onChange).toHaveBeenCalledWith([2017]);
  });

  it('calls onChange when year is toggled on', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearFilter selectedYears={[2017]} onChange={onChange} />);

    const checkbox2018 = screen.getByRole('checkbox', { name: '2018' });
    await user.click(checkbox2018);

    expect(onChange).toHaveBeenCalledWith([2017, 2018]);
  });
});
