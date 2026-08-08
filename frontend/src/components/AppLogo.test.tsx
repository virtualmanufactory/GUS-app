import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppLogo from './AppLogo';

describe('AppLogo', () => {
  it('renders logo image and app name', () => {
    render(
      <MemoryRouter>
        <AppLogo />
      </MemoryRouter>,
    );

    expect(screen.getByAltText('GusCompanyFinder')).toBeInTheDocument();
    expect(screen.getByText('GusCompanyFinder')).toBeInTheDocument();
  });

  it('hides name when showName is false', () => {
    render(
      <MemoryRouter>
        <AppLogo showName={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('GusCompanyFinder')).not.toBeInTheDocument();
    expect(screen.getByAltText('GusCompanyFinder')).toBeInTheDocument();
  });

  it('links to home by default', () => {
    render(
      <MemoryRouter>
        <AppLogo />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
