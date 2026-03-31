import { useState, useEffect } from 'react';
import type { WeatherResponse } from '../types/weather';
import { API_BASE } from '../config';

export function useWeather(lat: number | null, lon: number | null) {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (lat === null || lon === null) {
            return;
        }

        const controller = new AbortController();

        async function fetchWeather() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `${API_BASE}/api/weather?lat=${lat}&lon=${lon}`,
                    { signal: controller.signal }
                );
                if (!res.ok) {
                    throw new Error(`Weather API returned ${res.status}`);
                }
                const data: WeatherResponse = await res.json();
                if (!data.current_weather) {
                    throw new Error('No weather data available for this location');
                }
                setWeather(data);
            } catch (err) {
                if (!controller.signal.aborted) {
                    const message = err instanceof Error ? err.message : 'Failed to fetch weather';
                    if (message.includes('fetch')) {
                        setError('Unable to connect. Please check your internet connection.');
                    } else {
                        setError(message);
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();

        return () => controller.abort();
    }, [lat, lon]);

    return { weather, loading, error };
}
