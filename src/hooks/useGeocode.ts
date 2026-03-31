import { useState, useEffect } from 'react';
import type { GeocodingResult } from '../types/weather';
import { API_BASE } from '../config';

export function useGeocode(query: string) {
    const [results, setResults] = useState<GeocodingResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setNoResults(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setLoading(true);
            setError(null);
            setNoResults(false);
            try {
                const res = await fetch(
                    `${API_BASE}/api/geocode?name=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                );
                if (!res.ok) {
                    throw new Error('Search failed');
                }
                const data = await res.json() as { results?: GeocodingResult[] };
                const cities = data.results || [];
                setResults(cities);
                setNoResults(cities.length === 0);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setResults([]);
                    setNoResults(false);
                    setError(err instanceof Error ? err.message : 'Search failed');
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    return { results, loading, noResults, error };
}
