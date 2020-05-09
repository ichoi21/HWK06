var APIid = "&appid=987370c9088242014b673e9c345ee3d9";
var units = "&units=imperial";
var API = "http://api.openweathermap.org/data/2.5/weather?";

$(document).ready(function () {
  $("#btnSearch").on("click", function (e) {
    e.preventDefault();

    var citySearch = $("#citySearch").val();

    //City Temp
    $.ajax({
      type: "GET",
      url: API + "q=" + citySearch + units + APIid,
      dataType: "json",
    }).then(function (res) {
      console.log(res);
      temp = res.main.temp;
      console.log((humidity = res.main.humidity));
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      var weather = res.weather.main;
      var windSpeed = res.wind.speed;
      var icon = res.weather.icon;
      var countryCode = res.sys.country;
      var humidity = res.main.humidity;
      var date = new Date(results.dt * 1000).toLocaleDateString("en-US");

      $("#cityName").text(name);
      $("#temperature").text(temp);
      $("#humidity").text(humidity + "%");
    });
  });
  //City UV

  $.ajax({
    type: "GET",
    url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lat=${lon}&appid=${APIid}`,
    dataType: "json",
  }).then(function (res) {
    console.log(res);

    $("#cityName").text(name);
  });
  //City Forecast

  $.ajax({
    type: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch},${countryCode}&appid=${APIid}&units=imperial`,
    dataType: "json",
  }).then(function (res) {
    console.log(res);
  });
});
