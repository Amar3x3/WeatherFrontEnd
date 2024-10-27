// src/App.js
import React, { useState } from 'react';
import WeatherSummaryChart from './components/WeatherSummaryChart';

function App() {
  // Define city list
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

  // Set initial state for city and date
  const [city, setCity] = useState('Hyderabad');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in 'YYYY-MM-DD' format

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Weather Summary</h1>

      {/* City dropdown */}
      <label htmlFor="city">Select City: </label>
      <select
        id="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ marginRight: '20px', padding: '5px' }}
      >
        {cities.map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>

      {/* Date display (read-only) */}
      <label htmlFor="date">Date: </label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: '5px' }}
        readOnly
      />

      {/* Weather Summary Chart component */}
      <WeatherSummaryChart city={city} date={date} />
    </div>
  );
}

export default App;
