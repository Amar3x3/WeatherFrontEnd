// src/components/WeatherSummaryChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ForecastWidget from './ForecastWidget';
import WeatherAlert from './WeatherAlert';

// Register Chart.js components
Chart.register(...registerables);


const WeatherSummaryChart = ({ city, date }) => {
  const [max, setMax] = useState();
  const [min, setMin] = useState();
  const [yesterdayMax, setYesterdayMax] = useState();
  const [yesterdayMin, setYesterdayMin] = useState();
  const [yesterdayTempAvg, setYesterdayTempAvg] = useState();
  const [yesterdayHumidityAvg, setYesterdayHumidityAvg] = useState();
  const [yesterdayWindAvg, setYesterdayWindAvg] = useState();
  const [yesterdayDominantWeather, setYesterdayDominantWeather] = useState();

  const [chartData, setChartData] = useState({
    temperature: { labels: [], data: [] },
    humidity: { labels: [], data: [] },
    windspeed: { labels: [], data: [] },
  });

  const OPENWEATHERMAP_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2f654a32cfa80975ecf97fb85b05ce2f&units=metric`;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/weather/summaries`, {
          params: { city, date },
        });
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        var yes = yesterday.toISOString().split('T')[0];
        console.log()
        const current = await axios.get(OPENWEATHERMAP_URL);
        const daily = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/weather/daily-summary`, {
          params: { city, date}
        })
        console.log(daily.data)
        const curData = current.data;

        setYesterdayMax(daily.data.temperature.max);
        setYesterdayMin(daily.data.temperature.min);
        setYesterdayHumidityAvg(daily.data.humidity_avg);
        setYesterdayTempAvg(daily.data.temperature.avg);
        setYesterdayWindAvg(daily.data.wind_speed_avg);
        setYesterdayDominantWeather(daily.data.dominant_weather);

        setMax(curData.main.temp_max)
        setMin(curData.main.temp_min);

        const data = response.data;

        if (data.length > 0) {
          const labels = data.map((entry) => entry.time);
          const temperatures = data.map((entry) => entry.temperature.current);
          const humidities = data.map((entry) => entry.humidity);
          const windspeeds = data.map((entry) => entry.wind_speed);

          setChartData({
            temperature: {
              labels,
              data: temperatures,
            },
            humidity: {
              labels,
              data: humidities,
            },
            windspeed: {
              labels,
              data: windspeeds,
            },
          });
        } else {
          setChartData({
            temperature: { labels: [], data: [] },
            humidity: { labels: [], data: [] },
            windspeed: { labels: [], data: [] },
          });
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [city, date]);

  return (
    <div className='container'>
      <h2>Weather Summary for {city} on {date}</h2>
      <div className='forecast'>
        <ForecastWidget cityName={city} />
      </div>
      <div className='alert'> <WeatherAlert cityName={city} datatmp={chartData.temperature.data} /></div>

      <div className='charts'>
        {chartData.temperature.data.length > 0 && (
        <div className='temp-cont'>
          <h3>Temperature (°C)</h3>
          <Line
            data={{
              labels: chartData.temperature.labels,
              datasets: [{
                label: 'Temperature (°C)',
                data: chartData.temperature.data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
              }],
            }}
          />
        </div>
      )}

      {chartData.humidity.data.length > 0 && (
        <div className='temp-cont'>
          <h3>Humidity (%)</h3>
          <Line
            data={{
              labels: chartData.humidity.labels,
              datasets: [{
                label: 'Humidity (%)',
                data: chartData.humidity.data,
                fill: false,
                borderColor: 'rgb(153, 102, 255)',
              }],
            }}
          />
        </div>
      )}

      {chartData.windspeed.data.length > 0 && (
        <div className='temp-cont'>
          <h3>Wind Speed (m/s)</h3>
          <Line
            data={{
              labels: chartData.windspeed.labels,
              datasets: [{
                label: 'Wind Speed (m/s)',
                data: chartData.windspeed.data,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
              }],
            }}
          />
        </div>
      )}

</div>

      <div>
        <h1>Yesterday Summary</h1>
        max temperature : {yesterdayMax ? yesterdayMax.toFixed(2) :''}
        <p> min temperature : {yesterdayMin ? yesterdayMin.toFixed(2) : ''}</p>
        <p>average temperature : {yesterdayTempAvg ? yesterdayTempAvg.toFixed(2) : ''}</p>
        <p>humidity avg : {yesterdayHumidityAvg ? yesterdayHumidityAvg.toFixed(2) : ''}</p>
        <p>wind speed  avg : {yesterdayWindAvg ? yesterdayWindAvg.toFixed(2) : ''}</p>
        <p>dominant_weather : {yesterdayDominantWeather ? yesterdayDominantWeather : ''}</p>
      </div>
    </div>
  );
};

export default WeatherSummaryChart;
