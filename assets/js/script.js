var currentWeatherContainerEl = document.querySelector(
  ".current-weather-container"
);
var fiveDayForecastContainerEl = document.querySelector(".five-day-container");
var searchedCities = [];

// Fetch geographic coordinates [lat, lon] by using name of location (city name or area name).
var geoCoding = function (searchedCity) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchedCity +
      "&appid=379d1420e9fea3af7ba71fd81914bc2f"
  ).then(function (response) {
    response.json().then(function (data) {
      citySearch(data);
    });
  });
};

// Using the One Call API 3.0 search for the Citie's current and five day forcast.
var citySearch = function (data) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      data[0].lat +
      "&lon=" +
      data[0].lon +
      "&exclude={part}&units=imperial&appid=379d1420e9fea3af7ba71fd81914bc2f"
  ).then(function (response) {
    response.json().then(function (data) {
      currentWeather(data);
      fiveDayForecast(data);
    });
  });
};
// showcase the current weather conditions.
var currentWeather = function (data) {};
// showcase the five day weather conditions. 
var fiveDayForecast = function (data) {};
// build the basic template for weather conditions. 
var weatherTemplate = function (cityInput) {};

var saveCity = function (city) {
  if (localStorage.getItem("cities") === null) {
    searchedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
  } else {
    searchedCities = JSON.parse(localStorage.getItem("cities"));
    searchedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
  }
};

// Extract the search city name from input form.
var formHandler = function (e) {
  e.preventDefault();
  var cityInput = document.querySelector("#city-input").value.trim();
  // store in localStorage.
  saveCity(cityInput);
  //weather template
  weatherTemplate(cityInput);
  // use fetch api to find weather details.
  geoCoding(cityInput);
};

document.querySelector("#search-form").addEventListener("submit", formHandler);
