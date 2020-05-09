$(document).ready(function () {
  init();

  function init() {
    WeatherLook();
  }

  var citySearch;
  var APIid = "&appid=987370c9088242014b673e9c345ee3d9";
  var units = "&units=imperial";
  var API = "https://api.openweathermap.org/data/2.5/";

  function WeatherLook() {
    $("#btnSearch").on("click", function (e) {
      e.preventDefault();

      citySearch = $("#citySearch").val();
      console.log(citySearch);
      getWeather(citySearch);
    });
  }

  function getWeather(WeatherLook) {
    //City Temp
    $.ajax({
      type: "GET",
      url: API + "weather?q=" + citySearch + units + APIid,
      dataType: "json",
    }).then(function (response) {
      $("#current-forecast").show();
      var res = response;
      console.log(res);
      console.log((temp = Math.floor(res.main.temp)));
      var name = res.name;
      var date = new Date(res.dt * 1000).toLocaleDateString("en-US");
      var icon = res.weather[0].icon;
      var weather = res.weather[0].main.description;
      var temp = Math.floor(res.main.temp);
      var humidity = res.main.humidity;
      var windSpeed = res.wind.speed;
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      // var countryCode = res.sys.country;

      $("#cityName").text(name + " (" + date + ") ");
      $("#icon").attr(
        "src",
        "http://openweathermap.org/img/wn/" + icon + ".png"
      );
      $("#weather").html(weather);
      $("#temperature").html("<b>Temperature: </b>" + temp + " °F");
      $("#humidity").html("<b>Humidity: </b>" + humidity + "%");
      $("#windSpeed").html("<b>Wind Speed: </b>" + windSpeed + " MPH");

      // City UV

      $.ajax({
        type: "GET",
        url: API + "uvi?lat=" + lat + "&lon=" + lon + APIid,
        dataType: "json",
      }).then(function (uvResponse) {
        console.log(uvResponse);
        var uvRes = uvResponse;

        $("#uv-index").html(
          "<b>UV Index: </b>" +
            '<span class="badge badge-light" id="uvColor">' +
            uvRes.value +
            "</span>"
        );

        if (uvRes < 3) {
          $("#uvColor").css("background-color", "green");
        } else if (uvRes < 6) {
          $("#uvColor").css("background-color", "yellow");
        } else if (uvRes < 8) {
          $("#uvColor").css("background-color", "orange");
        } else if (uvRes < 11) {
          $("#uvColor").css("background-color", "red");
        } else {
          $("#uvColor").css("background-color", "violet");
        }
      });
    });
  }
  // //City Forecast

  // $.ajax({
  //   type: "GET",
  //   url: `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch},${countryCode}&appid=${APIid}&units=imperial`,
  //   dataType: "json",
  // }).then(function (res) {
  //   console.log(res);
  // });
});
