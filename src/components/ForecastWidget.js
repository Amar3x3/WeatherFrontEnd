// src/components/ForecastWidget.js
import React, { useEffect, useState } from 'react';

// Mapping of city names to city IDs
const cityIdMapping = {
  Pune: 1259229,
  Mumbai: 1275339,
  Delhi: 1273294,
  Kolkata: 1275004,
  Hyderabad: 1269843,
  Bangalore: 1277333,
  Chennai: 1264527,
};

const ForecastWidget = ({ cityName }) => {
  const [cityId, setCityId] = useState(null);

  useEffect(() => {
    // Get the city ID from the mapping based on the provided city name
    const id = cityIdMapping[cityName];
    if (id) {
      setCityId(id);
    } else {
      console.error('City not found in mapping:', cityName);
    }
  }, [cityName]);

  useEffect(() => {
    if (!cityId) return;

    // Reset widget parameters to avoid duplications
    window.myWidgetParam = [
      {
        id: 11,
        cityid: cityId,
        appid: '2f654a32cfa80975ecf97fb85b05ce2f', // Replace this with your actual API key
        units: 'metric',
        containerid: 'openweathermap-widget-11',
      },
    ];

    // Load d3 and widget generator scripts
    const d3Script = document.createElement('script');
    d3Script.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js';
    d3Script.async = true;
    document.body.appendChild(d3Script);

    const widgetScript = document.createElement('script');
    widgetScript.async = true;
    widgetScript.charset = 'utf-8';
    widgetScript.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
    document.body.appendChild(widgetScript);

    // Clear previous widget content before rendering a new one
    const widgetContainer = document.getElementById('openweathermap-widget-11');
    if (widgetContainer) widgetContainer.innerHTML = '';

    // Clean up scripts and widget params on unmount
    return () => {
      document.body.removeChild(d3Script);
      document.body.removeChild(widgetScript);
      window.myWidgetParam = [];
    };
  }, [cityId]);

  return <div className='forecast' id="openweathermap-widget-11"></div>;
};

export default ForecastWidget;
