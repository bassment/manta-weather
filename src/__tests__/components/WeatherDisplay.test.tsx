import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherDisplay } from '../../components/WeatherDisplay';

const baseWeather = {
  windspeed: 12,
  winddirection: 180,
  weathercode: 3,
  is_day: 1,
  time: '2026-03-30T12:00',
};

describe('WeatherDisplay', () => {
  it('renders city name, temperature, and weather description', () => {
    render(
      <WeatherDisplay
        cityName="Montevideo"
        country="Uruguay"
        weather={{ ...baseWeather, temperature: 24 }}
      />
    );

    expect(screen.getByText('Montevideo, Uruguay')).toBeInTheDocument();
    expect(screen.getByText('24°C')).toBeInTheDocument();
    expect(screen.getByText('Overcast')).toBeInTheDocument();
    expect(screen.getByText('Wind: 12 km/h')).toBeInTheDocument();
  });

  it('rounds temperature to nearest integer', () => {
    render(
      <WeatherDisplay
        cityName="Tokyo"
        country="Japan"
        weather={{ ...baseWeather, temperature: 15.7 }}
      />
    );

    expect(screen.getByText('16°C')).toBeInTheDocument();
  });

  it('shows correct emoji for clear day', () => {
    const { container } = render(
      <WeatherDisplay
        cityName="Cairo"
        country="Egypt"
        weather={{ ...baseWeather, weathercode: 0, is_day: 1, temperature: 35 }}
      />
    );

    expect(container.querySelector('.weather-emoji')?.textContent).toContain('☀️');
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
  });

  it('shows correct emoji for clear night', () => {
    const { container } = render(
      <WeatherDisplay
        cityName="Bangkok"
        country="Thailand"
        weather={{ ...baseWeather, weathercode: 0, is_day: 0, temperature: 28 }}
      />
    );

    expect(container.querySelector('.weather-emoji')?.textContent).toContain('🌙');
  });

  it('shows rain description for weather code 63', () => {
    render(
      <WeatherDisplay
        cityName="London"
        country="UK"
        weather={{ ...baseWeather, weathercode: 63, temperature: 8 }}
      />
    );

    expect(screen.getByText('Moderate rain')).toBeInTheDocument();
  });

  it('shows thunderstorm for weather code 95', () => {
    render(
      <WeatherDisplay
        cityName="KL"
        country="Malaysia"
        weather={{ ...baseWeather, weathercode: 95, temperature: 28 }}
      />
    );

    expect(screen.getByText('Thunderstorm')).toBeInTheDocument();
  });

  it('shows Unknown for unrecognized weather code', () => {
    render(
      <WeatherDisplay
        cityName="Mars"
        country="Space"
        weather={{ ...baseWeather, weathercode: 999, temperature: -50 }}
      />
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('has accessible section with aria-label', () => {
    render(
      <WeatherDisplay
        cityName="Amsterdam"
        country="Netherlands"
        weather={{ ...baseWeather, temperature: 10 }}
      />
    );

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-label', 'Weather for Amsterdam, Netherlands');
  });

  it('hides emoji from screen readers', () => {
    const { container } = render(
      <WeatherDisplay
        cityName="Test"
        country="City"
        weather={{ ...baseWeather, temperature: 20 }}
      />
    );

    const emoji = container.querySelector('.weather-emoji');
    expect(emoji).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles negative temperatures', () => {
    render(
      <WeatherDisplay
        cityName="Anchorage"
        country="USA"
        weather={{ ...baseWeather, weathercode: 71, temperature: -15.3 }}
      />
    );

    expect(screen.getByText('-15°C')).toBeInTheDocument();
    expect(screen.getByText('Slight snow')).toBeInTheDocument();
  });
});
