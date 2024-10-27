// src/components/WeatherAlert.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherAlert = ({ cityName }) => {
  const [threshold, setThreshold] = useState(35); // Default threshold in °C
  const [alert, setAlert] = useState(false);

  // OpenWeatherMap API URL
  const OPENWEATHERMAP_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2f654a32cfa80975ecf97fb85b05ce2f&units=metric`;

  // Function to fetch the latest temperature data
  const fetchLatestTemperature = async () => {
    try {
      const response = await axios.get(OPENWEATHERMAP_URL);
      const data = response.data;

      if (data.main && data.main.temp) {
        const latestTemperature = data.main.temp;

        // Check if temperature exceeds threshold
        if (latestTemperature > threshold) {
          setAlert(true);
          console.log(`Alert: Temperature in ${cityName} has exceeded ${threshold}°C! Current temperature: ${latestTemperature}°C`);
        } else {
          setAlert(false);
        }
      }
    } catch (error) {
      console.error('Error fetching latest temperature:', error);
    }
  };

  // Continuously check the temperature at a specified interval (5 minutes here)
  useEffect(() => {
    fetchLatestTemperature(); // Initial fetch
    const interval = setInterval(fetchLatestTemperature, 300000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [threshold]);

  return (
    <div>
      <h1>Weather Alert for {cityName}</h1>
      <label>
        Set Temperature Threshold (°C):
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </label>
      {alert && <p style={{ color: 'red' }}>Alert: Temperature exceeds threshold!</p>}
    </div>
  );
};

export default WeatherAlert;
