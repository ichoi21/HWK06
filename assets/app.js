$(document).ready(function () {
  var APIid = "&appid=987370c9088242014b673e9c345ee3d9";
  var units = "&units=imperial";
  var API = "http://api.openweathermap.org/data/2.5/weather?";

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
      var name = res.name;
      var date = new Date(res.dt * 1000).toLocaleDateString("en-US");
      var icon = res.weather[0].icon;
      var weather = res.weather.main.description;
      var temp = Math.floor(res.main.temp);
      var humidity = res.main.humidity;
      var windSpeed = res.wind.speed;

      var countryCode = res.sys.country;

      $("#cityName").text(name + " (" + date + ") ");
      $("#icon").attr(
        "src",
        "http://openweathermap.org/img/wn/" + icon + ".png"
      );
      $("#weather").html(weather);
      $("#temperature").html("<b>Temperature: </b>" + temperature + " °F");
      $("#humidity").html("<b>Humidity: </b>" + humidity + "%");
      $("#windSpeed").html("<b>Wind Speed: </b>" + windSpeed + " MPH");
    });
  });
  //City UV

  var lat = res.coord.lat;
  var lon = res.coord.lon;

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
