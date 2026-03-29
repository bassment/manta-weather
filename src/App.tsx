  import { useState } from 'react';                                                                                               
  import { SearchBar } from './components/SearchBar';                                                                                               
  import type { GeocodingResult } from './types/weather';                                                                                           
  import './App.css';
                                                                                                                                                    
  function App() {                                                
    const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
                                                                                                                                                    
    return (
      <div className="app">                                                                                                                         
        <h1>Manta Weather</h1>                                    
        <SearchBar onCitySelect={setSelectedCity} />
        {selectedCity && (
          <p>Selected: {selectedCity.name}, {selectedCity.country} ({selectedCity.latitude}, {selectedCity.longitude})</p>
        )}                                                                                                                                          
      </div>
    );                                                                                                                                              
  }                                                               

  export default App;  