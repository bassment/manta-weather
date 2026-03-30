import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherDisplay } from './WeatherDisplay';

describe('WeatherDisplay', () => {
  it('renders city name, temperature, and weather description', () => {
    render(
      <WeatherDisplay
        cityName="Montevideo"
        country="Uruguay"
        weather={{
          temperature: 24,
          windspeed: 12,
          winddirection: 180,
          weathercode: 3,
          is_day: 1,
          time: '2026-03-30T12:00',
        }}
      />
    );

    expect(screen.getByText('Montevideo, Uruguay')).toBeInTheDocument();
    expect(screen.getByText('24°C')).toBeInTheDocument();
    expect(screen.getByText('Overcast')).toBeInTheDocument();
    expect(screen.getByText('Wind: 12 km/h')).toBeInTheDocument();
  });
});
