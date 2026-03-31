import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for a city...')).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-label', 'Search for a city');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  it('has search landmark wrapper', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('updates input value on typing', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Tokyo' } });
    expect(input).toHaveValue('Tokyo');
  });

  it('does not show dropdown when query is too short', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'T' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown on Escape key', () => {
    render(<SearchBar onCitySelect={vi.fn()} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
