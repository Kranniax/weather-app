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
 console.log(data);
};

var formHandler = function (e) {
  e.preventDefault();
  var cityInput = document.querySelector("#city-input").value.trim();
  geoCoding(cityInput);
};

document.querySelector("#search-form").addEventListener("submit", formHandler);
