const apiKey = "94ee1bc891d0e3d90ce932fbde7ab34f";

const fetchWeatherBtn = document.getElementById('fetch-weather');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

window.addEventListener('DOMContentLoaded', () => {
  fetchWeather('Mumbai,IN');

  // Set up button listener
  document.getElementById('fetch-weather').addEventListener('click', () => {
    const city = cityInput.value.trim();
    const errorMsg = document.getElementById('error-message');
    errorMsg.classList.add('hidden');

    if (!city) {
      errorMsg.textContent = 'Please enter a city name.';
      errorMsg.classList.remove('hidden');
      return;
    }

    fetchWeather(city);
  });
});

async function fetchWeather(city) {
  try {
    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!weatherResponse.ok) throw new Error('City not found');

    const weatherData = await weatherResponse.json();
    displayWeather(weatherData);

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!forecastResponse.ok) throw new Error('Could not load forecast');

    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);

  } catch (error) {
    const errorMsg = document.getElementById('error-message');
    errorMsg.textContent = `Error: ${error.message}`;
    errorMsg.classList.remove('hidden');
  }
}


function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const condition = weather[0].main.toLowerCase();

  // Hide error if visible
  document.getElementById('error-message').classList.add('hidden');

  setWeatherBackground(condition);

  console.log('weather-icon element:', document.getElementById('weather-icon'));

  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById('weather-icon').src = iconUrl;

  document.getElementById('weather-heading').innerText = `Weather in ${name}`;
  document.getElementById('temperature').innerText = `🌡️ Temperature: ${main.temp} °C`;
  document.getElementById('condition').innerText = `🌤️ Condition: ${weather[0].description}`;
  document.getElementById('humidity').innerText = `💧 Humidity: ${main.humidity}%`;
  document.getElementById('wind').innerText = `💨 Wind: ${wind.speed} m/s`;

  weatherResult.classList.remove('hidden');
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; // clear previous

  // Group by date (only pick one forecast per day, e.g. 12:00)
  const dailyForecasts = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    const time = item.dt_txt.split(' ')[1];

    if (time === '12:00:00') {
      dailyForecasts[date] = item;
    }
  });

  Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
    const item = dailyForecasts[date];
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    const temp = item.main.temp.toFixed(1);
    const desc = item.weather[0].main;

    const dayEl = document.createElement('div');
    dayEl.classList.add('day');
    dayEl.innerHTML = `
      <h4>${new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</h4>
      <img src="${iconUrl}" alt="${desc}" />
      <p>${desc}</p>
      <p>${temp}°C</p>
    `;

    forecastContainer.appendChild(dayEl);
  });

  document.getElementById('forecast').classList.remove('hidden');
}


function getWeatherEmoji(condition) {
  if (condition.includes('cloud')) return '☁️';
  if (condition.includes('rain')) return '🌧️';
  if (condition.includes('clear')) return '☀️';
  if (condition.includes('thunderstorm')) return '⛈️';
  if (condition.includes('snow')) return '❄️';
  if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
  return '🌡️';
}


function setWeatherBackground(condition) {
  const body = document.body;
  body.classList.add('weather-bg');

  let imageUrl;

  switch (condition.toLowerCase()) {
    case 'clear':
      imageUrl = "./images/sunny.jpg";
      break;
    case 'clouds':
      imageUrl = "./images/cloudy.jpg";
      break;
    case 'rain':
    case 'drizzle':
      imageUrl = "./images/rainy.jpg";
      break;
    case 'thunderstorm':
      imageUrl = "./images/thunderstorm.jpg";
      break;
    case 'snow':
      imageUrl = "./images/snow.jpg";
      break;
    case 'mist':
    case 'fog':
      imageUrl = "./images/fog.jpg";
      break;
    default:
      imageUrl = 'https://source.unsplash.com/1600x900/?weather';
  }

  body.style.backgroundImage = `url('${imageUrl}')`;
}

function updateDateTime() {
  const now = new Date();
  const datetimeElement = document.getElementById('datetime');

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const formattedDate = now.toLocaleString('en-IN', options);
  datetimeElement.textContent = formattedDate;
}

setInterval(updateDateTime, 1000); // Updates every second
updateDateTime(); // Initial call
