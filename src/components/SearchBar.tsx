import { useState } from 'react';
  import { useGeocode } from '../hooks/useGeocode';
  import type { GeocodingResult } from '../types/weather';
  import './SearchBar.css';

  interface SearchBarProps {
    onCitySelect: (city: GeocodingResult) => void;
  }

  export function SearchBar({ onCitySelect }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { results, loading } = useGeocode(query);

    const handleSelect = (city: GeocodingResult) => {
      setQuery(city.name);
      setIsOpen(false);
      onCitySelect(city);
    };

    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          aria-label="Search for a city"
          aria-expanded={isOpen && results.length > 0}
          role="combobox"
          aria-autocomplete="list"
        />
        {loading && <span className="search-loading">Searching...</span>}
        {isOpen && results.length > 0 && (
          <ul className="search-results" role="listbox">
            {results.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelect(city)}
                role="option"
              >
                {city.name}, {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }