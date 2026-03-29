import { useState, useEffect } from 'react';                                                                                                      
  import { SearchBar } from './components/SearchBar';                                                                                               
  import { WeatherDisplay } from './components/WeatherDisplay';                                                                                     
  import { useWeather } from './hooks/useWeather';
  import './App.css';                                        
  
  import type { GeocodingResult, RecentCity } from './types/weather';
   
  function App() {                                                                                                                                  
    const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);                                                               
    const [recentCities, setRecentCities] = useState<RecentCity[]>([]);
    const { weather, loading, error } = useWeather(                                                                                                 
      selectedCity?.latitude ?? null,
      selectedCity?.longitude ?? null                                                                                                               
    );                                                                                                                                              
   
    // Save to recent when weather loads                                                                                                            
    useEffect(() => {                                                                                                                             
      if (!selectedCity || !weather?.current_weather) return;
                                                                                                                                                    
      fetch('http://localhost:8787/api/recent', {
        method: 'POST',                                                                                                                             
        headers: { 'Content-Type': 'application/json' },                                                                                          
        body: JSON.stringify({                                                                                                                      
          id: selectedCity.id,
          name: selectedCity.name,                                                                                                                  
          country: selectedCity.country,                                                                                                          
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
      fetch('http://localhost:8787/api/recent')                                                                                                     
        .then((res) => res.json() as Promise<RecentCity[]>)                                                                                                                
        .then(setRecentCities)
        .catch(() => {});
    }, []);
                                                                                                                                                    
    return (
      <div className="app">                                                                                                                         
        <h1>Manta Weather</h1>                                                                                                                    
        <SearchBar onCitySelect={setSelectedCity} />
        {loading && <p>Loading weather...</p>}
        {error && <p>{error}</p>}                                                                                                                   
        {weather?.current_weather && selectedCity && (
          <WeatherDisplay                                                                                                                           
            cityName={selectedCity.name}                                                                                                            
            country={selectedCity.country}
            weather={weather.current_weather}                                                                                                       
          />                                                                                                                                      
        )}
        {recentCities.length > 0 && (
          <div className="recent-cities">                                                                                                           
            <h3>Recently Searched</h3>
            <ul>                                                                                                                                    
              {recentCities.map((city) => (                                                                                                       
                <li key={city.id}>                                                                                                                  
                  {city.name}, {city.country} — {Math.round(city.temperature)}°C
                </li>                                                                                                                               
              ))}                                                                                                                                 
            </ul>                                                                                                                                   
          </div>                                                                                                                                  
        )}
      </div>
    );
  }

  export default App;