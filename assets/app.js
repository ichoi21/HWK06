var APIid = "987370c9088242014b673e9c345ee3d9";

$(document).ready(function () {
  $("#btnSearch").on("click", function (e) {
    e.preventDefault();
    var citySearch = $("#citySearch").val();

    //City Temp
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${APIid}&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);
      temp = res.main.temp;
      console.log((humidity = res.main.humidity));
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      weather = res.weather.main;
      weatherdes = res.weather.description;
      icon = res.weather.icon;
      var countryCode = res.sys.country;
      humidity = res.main.humidity;
      // $("#weather-display").text(`<h3>The temperature is ${temp} *F</h3>
      // <br />
      // <h3>${weather} with ${weatherdes}</h3>
      // <br />
      // <h3>${icon}</h3>`);
      $("#weather-display").prepend(
        `<h3>The temperature is ${temp} with ${weatherdes} ${icon}</h3>`
      );
    });
    //City UV

    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lat=${lon}&appid=${APIid}`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);

      $("#weather-display").text(`<h4>Coordinates is ${lat}, ${lon}</h4>`);
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
});
