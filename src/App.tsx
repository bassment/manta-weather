import { useState, useEffect, useRef } from 'react';
import { SearchBar, type SearchBarHandle } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { WeatherBackground } from './components/WeatherBackground';
import { useWeather } from './hooks/useWeather';
import { API_BASE } from './config';
import './App.css';

import type { GeocodingResult, RecentCity } from './types/weather';

function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
  const [recentCities, setRecentCities] = useState<RecentCity[]>([]);
  const { weather, loading, error } = useWeather(
    selectedCity?.latitude ?? null,
    selectedCity?.longitude ?? null
  );

  const hasAutoLocated = useRef(false);
  const searchBarRef = useRef<SearchBarHandle>(null);

  useEffect(() => {
    if (hasAutoLocated.current) return;
    hasAutoLocated.current = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `${API_BASE}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json() as { address?: { city?: string; town?: string; country?: string } };
          const cityName = data.address?.city || data.address?.town || 'Your Location';
          const country = data.address?.country || '';
          setSelectedCity({ id: 0, name: cityName, latitude, longitude, country });
        } catch {
          setSelectedCity({ id: 0, name: 'Your Location', latitude, longitude, country: '' });
        }
      },
      () => {
        setSelectedCity({
          id: 3441575,
          name: 'Montevideo',
          latitude: -34.90328,
          longitude: -56.18816,
          country: 'Uruguay',
        });
      },
      { timeout: 5000 }
    );
  }, []);

  // Save to recent when weather loads
  useEffect(() => {
    if (!selectedCity || !weather?.current_weather) return;

    fetch(`${API_BASE}/api/recent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedCity.id,
        name: selectedCity.name,
        country: selectedCity.country,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        temperature: weather.current_weather.temperature,
        weathercode: weather.current_weather.weathercode,
        is_day: weather.current_weather.is_day,
      }),
    })
      .then((res) => res.json() as Promise<RecentCity[]>)
      .then(setRecentCities)
      .catch(() => {});
  }, [weather, selectedCity]);

  // Load recent on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/recent`)
      .then((res) => res.json() as Promise<RecentCity[]>)
      .then(setRecentCities)
      .catch(() => {});
  }, []);

  const weatherCode = weather?.current_weather?.weathercode ?? null;
  const isDay = weather?.current_weather ? weather.current_weather.is_day === 1 : null;

  return (
    <WeatherBackground weatherCode={weatherCode} isDay={isDay}>
      <a href="#weather-content" className="skip-link">Skip to weather</a>
      <main className="app" id="weather-content">
        <h1>Manta Weather</h1>
        <SearchBar ref={searchBarRef} onCitySelect={setSelectedCity} />
        <div aria-live="polite" aria-atomic="true">
          {loading && <p className="status-msg">Loading weather...</p>}
          {error && <p className="status-msg error" role="alert">{error}</p>}
        </div>
        {weather?.current_weather && selectedCity && (
          <WeatherDisplay
            cityName={selectedCity.name}
            country={selectedCity.country}
            weather={weather.current_weather}
          />
        )}
        {recentCities.length > 0 && (
          <nav className="recent-cities" aria-label="Recently searched cities">
            <h2>Recently Searched</h2>
            <ul>
              {recentCities.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => {
                      searchBarRef.current?.clear();
                      setSelectedCity({
                        id: city.id,
                        name: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        country: city.country,
                      });
                    }}
                    aria-label={`View weather for ${city.name}, ${city.country}, ${Math.round(city.temperature)} degrees Celsius`}
                  >
                    {city.name}, {city.country} — {Math.round(city.temperature)}°C
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>
    </WeatherBackground>
  );
}

export default App;
