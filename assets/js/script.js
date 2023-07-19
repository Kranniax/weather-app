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
      citySearch(data, searchedCity);
    });
  });
};

// Using the One Call API 3.0 search for the Citie's current and five day forcast.
var citySearch = function (data, city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      data[0].lat +
      "&lon=" +
      data[0].lon +
      "&exclude={part}&units=imperial&appid=379d1420e9fea3af7ba71fd81914bc2f"
  ).then(function (response) {
    response.json().then(function (data) {
      currentWeather(data, city);
      // fiveDayForecast(data);
    });
  });
};
// showcase the current weather conditions.
var currentWeather = function (data, city) {
  // clear old weather data first.
  currentWeatherContainerEl.innerHTML = "";

  // card container to hold weather details.
  var cardContainerEl = document.createElement("div");
  cardContainerEl.classList.add("card");
  cardContainerEl.setAttribute("style", "width: 18rem");

  // card body to include the title and body content.
  var cardBodyEl = document.createElement("div");
  cardBodyEl.classList.add("card-body");

  // card title for the searched city.
  var cardTitleEl = document.createElement("h5");
  cardTitleEl.classList.add("card-title");
  cardTitleEl.textContent = city;

  var cardSubtitle = document.createElement("h6");
  cardSubtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
  cardSubtitle.textContent = "Current Weather";

  // a list group to display the temp, wind, humidity and uv index.
  var weatherDetailsContainer = document.createElement("ul");
  weatherDetailsContainer.classList.add("list-group");

  var tempIconContainer = document.createElement("li");
  tempIconContainer.classList.add(
    "border-0",
    "list-group-item",
    "padding-left"
  );

  var tempIcon = document.createElement("img");
  tempIcon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" +
      data.current.weather[0].icon +
      "@2x.png"
  );

  tempIconContainer.appendChild(tempIcon);

  // current weather temperature
  var tempDetail = document.createElement("li");
  tempDetail.classList.add("border-0", "list-group-item", "padding-left");
  tempDetail.innerHTML = "Temp: " + data.current.temp + "°F";

  // append weather temperature & weather temperature icon
  tempIconContainer.appendChild(tempIcon);
  tempDetail.appendChild(tempIconContainer);

  // current wind speed
  var windDetail = document.createElement("li");
  windDetail.classList.add("list-group-item", "border-0", "padding-left");
  windDetail.innerHTML = "Wind: " + data.current.wind_speed + " MPH";

  // current humidty percentage
  var humidityDetail = document.createElement("li");
  humidityDetail.classList.add("list-group-item", "border-0", "padding-left");
  humidityDetail.innerHTML = "Humidity: " + data.current.humidity + "%";

  // current uv index.
  var uVDetail = document.createElement("li");
  uVDetail.classList.add("list-group-item", "border-0", "padding-left");
  uVDetail.textContent = "UV Index: ";
  var uvIndexButton = document.createElement("button");
  uvIndexButton.textContent = data.current.uvi;

  // check uvi heat ranges
  if (data.current.uvi < 3) {
    uvIndexButton.classList.add("btn", "btn-success", "btn-sm", "uvi-padding");
  } else if (data.current.uvi < 7) {
    uvIndexButton.classList.add("btn", "btn-warning", "btn-sm", "uvi-padding");
  } else {
    uvIndexButton.classList.add("btn", "btn-danger", "btn-sm", "uvi-padding");
  }
  uVDetail.appendChild(uvIndexButton);

  // append all child elements to weather details container.
  weatherDetailsContainer.appendChild(tempIconContainer);
  weatherDetailsContainer.appendChild(tempDetail);
  weatherDetailsContainer.appendChild(windDetail);
  weatherDetailsContainer.appendChild(humidityDetail);
  weatherDetailsContainer.appendChild(uVDetail);

  // append all card sections to main element.
  cardBodyEl.appendChild(cardTitleEl);
  cardBodyEl.appendChild(cardSubtitle);
  cardBodyEl.appendChild(weatherDetailsContainer);
  cardContainerEl.appendChild(cardBodyEl);
  currentWeatherContainerEl.appendChild(cardContainerEl);
};
// showcase the five day weather conditions.
var fiveDayForecast = function (data) {};

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
  cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);

  // store in localStorage.
  saveCity(cityInput);

  // use fetch api to find weather details.
  geoCoding(cityInput);
};

document.querySelector("#search-form").addEventListener("submit", formHandler);
