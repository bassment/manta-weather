import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherBackground } from '../../components/WeatherBackground';

describe('WeatherBackground', () => {
  it('renders children', () => {
    render(
      <WeatherBackground weatherCode={0} isDay={true}>
        <p>Hello World</p>
      </WeatherBackground>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders with null weather code (loading state)', () => {
    render(
      <WeatherBackground weatherCode={null} isDay={null}>
        <p>Loading content</p>
      </WeatherBackground>
    );

    expect(screen.getByText('Loading content')).toBeInTheDocument();
  });

  it('sets text color based on weather theme', () => {
    const { container } = render(
      <WeatherBackground weatherCode={0} isDay={true}>
        <p>Sunny day</p>
      </WeatherBackground>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.color).toBeTruthy();
  });

  it('renders different themes for day vs night', () => {
    const { container: dayContainer } = render(
      <WeatherBackground weatherCode={0} isDay={true}>
        <p>Day</p>
      </WeatherBackground>
    );

    const { container: nightContainer } = render(
      <WeatherBackground weatherCode={0} isDay={false}>
        <p>Night</p>
      </WeatherBackground>
    );

    const dayWrapper = dayContainer.firstChild as HTMLElement;
    const nightWrapper = nightContainer.firstChild as HTMLElement;
    expect(dayWrapper.style.color).not.toEqual(nightWrapper.style.color);
  });
});
