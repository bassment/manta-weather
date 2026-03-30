import { useState, useEffect } from 'react';
import type { WeatherResponse } from '../types/weather';

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
                `http://localhost:8787/api/weather?lat=${lat}&lon=${lon}`,
                { signal: controller.signal }
                );
                const data: WeatherResponse = await res.json();
                setWeather(data);
            } catch {
                if (!controller.signal.aborted) {
                setError('Failed to fetch weather');
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
