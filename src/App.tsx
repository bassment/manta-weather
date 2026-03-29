import { useState } from 'react';                                                                                                                 
  import { SearchBar } from './components/SearchBar';                                                                                             
  import { WeatherDisplay } from './components/WeatherDisplay';                                                                                     
  import { useWeather } from './hooks/useWeather';
  import type { GeocodingResult } from './types/weather';                                                                                           
  import './App.css';                                                                                                                             

  function App() {                                                                                                                                  
    const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
    const { weather, loading, error } = useWeather(                                                                                                 
      selectedCity?.latitude ?? null,                                                                                                             
      selectedCity?.longitude ?? null                                                                                                               
    );
                                                                                                                                                    
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
      </div>                                                                                                                                      
    );
  }

  export default App;