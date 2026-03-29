import { useState, useEffect } from 'react';
import type { GeocodingResult } from '../types/weather';

export function useGeocode(query: string) {
    const [results, setResults] = useState<GeocodingResult[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
    const timeout = setTimeout(async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8787/api/geocode?name=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, 300);

    return () => clearTimeout(timeout);
    }, [query]);
    
    return { results, loading };
}