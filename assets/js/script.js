var currentWeatherContainerEl = $(".current-weather-container");
var fiveDayForecastContainerEl = $(".five-day-container .row");
var fiveDaySectionTitle = document.querySelector(".five-day-container h4");
var searchedCities = [];
var searchHistory = [];

// Fetch geographic coordinates [lat, lon] by using name of location (city name or area name).
var geoCoding = function (searchedCity) {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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
  var oldURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    data[0].lat +
    "&lon=" +
    data[0].lon +
    "&exclude={part}&units=imperial&appid=379d1420e9fea3af7ba71fd81914bc2f";

  // var newURL =
  //   "https://api.openweathermap.org/data/2.5/weather?q=" +
  //   city +
  //   "&appid=379d1420e9fea3af7ba71fd81914bc2f&units=imperial&exclude={part}";
  fetch(oldURL).then(function (response) {
    response.json().then(function (data) {
      console.log(data);

      currentWeather(data, city);
      fiveDayForecast(data);
    });
  });
};
// showcase the current weather conditions.
var currentWeather = function (data, city) {
  // clear old weather data first.
  $(".current-weather-container").empty();

  // card container to hold weather details.
  var cardContainerEl = $("<div>")
    .addClass("card")
    .attr("style", "width: 18rem");
  // card body to include the title and body content.
  var cardBodyEl = $("<div>").addClass("card-body");

  var time = moment().format("L");

  // card title for the searched city.
  var cardTitleEl = $("<h5>")
    .addClass("card-title")
    .html(city + " - " + time);

  // a list group to display the temp, wind, humidity and uv index.
  var weatherDetailsContainer = $("<ul>").addClass("list-group");

  // a container to hold temperature icon
  var tempIconContainer = $("<li>").addClass(
    "border-0 list-group-item padding-left"
  );

  var tempIcon = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" +
      data.current.weather[0].icon +
      "@2x.png"
  );

  tempIconContainer.append(tempIcon);

  // current weather temperature
  var tempDetail = $("<li>")
    .addClass("border-0 list-group-item padding-left")
    .html("Temp: " + Math.round(data.current.temp) + "°F");

  // current wind speed
  var windDetail = $("<li>")
    .addClass("list-group-item border-0 padding-left")
    .html("Wind: " + Math.round(data.current.wind_speed) + " MPH");

  // current humidty percentage
  var humidityDetail = $("<li>")
    .addClass("list-group-item border-0 padding-left")
    .html("Humidity: " + data.current.humidity + "%");

  // current uv index.
  var uVDetail = $("<li>")
    .addClass("list-group-item border-0 padding-left")
    .text("UV Index: ");
  var uvIndexButton = $("<button>").text(data.current.uvi);

  // check uvi heat ranges
  if (data.current.uvi < 3) {
    uvIndexButton.addClass("btn btn-success btn-sm uvi-padding");
  } else if (data.current.uvi < 7) {
    uvIndexButton.addClass("btn btn-warning btn-sm uvi-padding");
  } else {
    uvIndexButton.addClass("btn btn-danger btn-sm uvi-padding");
  }
  uVDetail.append(uvIndexButton);
  // append all weather details under one weather container.
  weatherDetailsContainer.append(
    tempIconContainer,
    tempDetail,
    windDetail,
    humidityDetail,
    uVDetail
  );

  // append all card sections to main element.
  cardBodyEl.append(cardTitleEl, weatherDetailsContainer);
  cardContainerEl.append(cardBodyEl);
  currentWeatherContainerEl.append(cardContainerEl);
};
// showcase the five day weather conditions.
var fiveDayForecast = function (data) {
  // clear old weather data first.
  $(".five-day-container .row").html("");

  // show five day forecast section title.
  fiveDaySectionTitle.classList.replace("d-none", "d-block");

  for (var i = 0; i < data.daily.length - 3; i++) {
    // card container to hold weather details.
    var cardContainerEl = $("<div>")
      .addClass("card col m-3")
      .attr("style", "width: 18rem");

    // weather icon
    var weatherImage = $("<img>")
      .addClass("card-img-top")
      .attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          data.daily[i].weather[0].icon +
          "@2x.png"
      );

    // card title for the searched city.
    var cardTitleEl = $("<h5>")
      .addClass("card-title pl-3")
      .text(moment.unix(data.daily[i].dt).format("L"));

    // card body to include the title and body content.
    var cardBodyEl = $("<div>").addClass("card-body");

    // a list group to display the temp, wind, humidity and uv index.
    var weatherDetailsContainer = $("<ul>").addClass("list-group");

    // current weather temperature
    var tempDetail = $("<li>")
      .addClass("border-0 list-group-item padding-left")
      .html("Daily Temp: " + Math.round(data.daily[i].temp.day) + "°F");

    // current wind speed
    var windDetail = $("<li>")
      .addClass("list-group-item border-0 padding-left")
      .html("Wind: " + Math.round(data.daily[i].wind_speed) + " MPH");

    // current humidty percentage
    var humidityDetail = $("<li>")
      .addClass("list-group-item border-0 padding-left")
      .html("Humidity: " + data.daily[i].humidity + "%");

    // append all card sections to main element.
    weatherDetailsContainer.append(tempDetail, windDetail, humidityDetail);
    cardBodyEl.append(weatherDetailsContainer);
    cardContainerEl.append(weatherImage, cardTitleEl, cardBodyEl);
    fiveDayForecastContainerEl.append(cardContainerEl);
  }
};
// Save searched cites within localStorage API.
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
// create a DOM list element of recently searched cities.
var recentSearch = function (city) {
  var listEl = $("<button>")
    .addClass("list-group-item list-group-item")
    .text(city);
  // store in localStorage.
  saveCity(city);

  $(".search-history-container").on("click", function (event) {
    // console.log(event.target.tagName);
    if (event.target.tagName == "BUTTON") {
      geoCoding(event.target.textContent);
    }
  });

  $(".search-history-container").append(listEl);
};

// loads prior search history.
var loadRecentCities = function () {
  searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
  // console.log(searchHistory);
  for (var i = 0; i < searchHistory.length; i++) {
    var listEl = $("<button>")
      .addClass("list-group-item list-group-item")
      .text(searchHistory[i]);

    $(".search-history-container").on("click", function (event) {
      // console.log(event.target.tagName);
      if (event.target.tagName == "BUTTON") {
        geoCoding(event.target.textContent);
      }
    });

    $(".search-history-container").append(listEl);
  }
};
// Extract the search city name from input form.
var formHandler = function (e) {
  e.preventDefault();
  var cityInput = $("#city-input").val().trim();
  cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);

  // use fetch api to find weather details.
  geoCoding(cityInput);
  // create a list of recent city searches on the DOM.
  recentSearch(cityInput);

  // clear input field after submit.
  $("#city-input").val("");
};

$("#search-form").on("submit", formHandler);

loadRecentCities();
