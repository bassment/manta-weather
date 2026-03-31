import { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useGeocode } from '../hooks/useGeocode';
import type { GeocodingResult } from '../types/weather';
import './SearchBar.css';

interface SearchBarProps {
  onCitySelect: (city: GeocodingResult) => void;
}

export interface SearchBarHandle {
  clear: () => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(function SearchBar({ onCitySelect }, ref) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, loading, noResults, error } = useGeocode(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setQuery('');
      setIsOpen(false);
      setActiveIndex(-1);
    },
  }));

  const handleSelect = useCallback((city: GeocodingResult) => {
    setQuery(city.name);
    setIsOpen(false);
    setActiveIndex(-1);
    onCitySelect(city);
    inputRef.current?.focus();
  }, [onCitySelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeId = activeIndex >= 0 ? `search-option-${activeIndex}` : undefined;

  return (
    <div className="search-bar" role="search">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        onBlur={() => { setTimeout(() => setIsOpen(false), 150); }}
        aria-label="Search for a city"
        aria-expanded={isOpen && results.length > 0}
        aria-controls="search-listbox"
        aria-activedescendant={activeId}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        autoComplete="off"
      />
      {loading && <span className="search-loading" aria-live="polite">Searching...</span>}
      {isOpen && noResults && !loading && (
        <div className="search-no-results" role="status">No cities found for "{query}"</div>
      )}
      {isOpen && error && !loading && (
        <div className="search-error" role="alert">{error}</div>
      )}
      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          id="search-listbox"
          className="search-results"
          role="listbox"
          aria-label="City suggestions"
        >
          {results.map((city, index) => (
            <li
              key={city.id}
              id={`search-option-${index}`}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'active' : ''}
            >
              {city.name}, {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
