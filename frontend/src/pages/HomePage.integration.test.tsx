import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomePage from './HomePage';

describe('HomePage integration', () => {
  it('renders app branding and navigation links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'GusCompanyFinder' })).toBeInTheDocument();
    expect(screen.getByAltText('GusCompanyFinder')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard populacji' })).toHaveAttribute(
      'href',
      '/population',
    );
    expect(screen.getByRole('link', { name: 'Zatrudnienie i branże' })).toHaveAttribute(
      'href',
      '/employment',
    );
  });
});
