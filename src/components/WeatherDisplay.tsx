import type { CurrentWeather } from '../types/weather';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  cityName: string;
  country: string;
  weather: CurrentWeather;
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight showers',
    81: 'Moderate showers',
    82: 'Violent showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
}

function getWeatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}

export function WeatherDisplay({ cityName, country, weather }: WeatherDisplayProps) {
  const emoji = getWeatherEmoji(weather.weathercode, weather.is_day === 1);
  const description = getWeatherDescription(weather.weathercode);
  const temp = Math.round(weather.temperature);

  return (
    <section
      className="weather-display"
      aria-label={`Weather for ${cityName}, ${country}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="weather-emoji" aria-hidden="true">{emoji}</div>
      <h2>{cityName}, {country}</h2>
      <div className="weather-temp" aria-label={`${temp} degrees Celsius`}>{temp}°C</div>
      <p className="weather-desc">{description}</p>
      <div className="weather-details">
        <span aria-label={`Wind speed ${weather.windspeed} kilometers per hour`}>
          Wind: {weather.windspeed} km/h
        </span>
      </div>
    </section>
  );
}
