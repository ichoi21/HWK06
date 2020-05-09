$(document).ready(function () {
  init();

  function init() {
    WeatherLook();
  }

  var citySearch;
  var APIid = "&appid=987370c9088242014b673e9c345ee3d9";
  var units = "&units=imperial";
  var cnt = "&cnt=5";
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
      // console.log(res);
      // console.log((temp = Math.floor(res.main.temp)));
      var name = res.name;
      var date = new Date(res.dt * 1000).toLocaleDateString("en-US");
      var icon = res.weather[0].icon;
      var weather = res.weather[0].main.description;
      var temp = Math.floor(res.main.temp);
      var humidity = res.main.humidity;
      var windSpeed = res.wind.speed;
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      var countryCode = res.sys.country;

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
        // console.log(uvResponse);
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

      //City 5 Day Forecast

      $.ajax({
        type: "GET",
        url:
          API + "forecast?q=" + name + "," + countryCode + units + cnt + APIid,
        dataType: "json",
      }).then(function (forecastResponse) {
        console.log(forecastResponse);
        var fRes = forecastResponse;
        var fArr = [];

        for (var i = 0; i < 6; i += 13) {
          var fObj = {};
          var fResDate = fRes.list[i].dt_txt;
          var fDate = new Date(fResDate).toLocaleDateString("en-US");
          var fTemp = fRes.list[i].main.temp;
          var fHumidity = fRes.list[i].main.humidity;
          var fIcon = fRes.list[i].weather[0].icon;

          fObj["list"] = {};
          fObj["list"]["date"] = fDate;
          fObj["list"]["temp"] = fTemp;
          fObj["list"]["humidity"] = fHumidity;
          fObj["list"]["icon"] = fIcon;

          fArr.push(fObj);
        }

        for (var j = 0; j < 6; j++) {
          var fArrDate = fArr[j].list.date;
          var fIconURL =
            "http://openweathermap.org/img/wn/" + fArr[j].list.icon + ".png";
          var fArrTemp = Math.floor(fArr[j].list.temp);
          var fArrHumidity = fArr[j].list.humidity;

          $("#d-" + (j + 1)).text(fArrDate);
          $("#image-" + (j + 1)).attr("src", fIconURL);
          $("#temp-" + (j + 1)).text("Temp: " + Math.floor(fArrTemp) + " °F");
          $("#humidity-" + (j + 1)).text("Humidity: " + fArrHumidity + "%");
        }
        $("#5Dforecast").show();
        console.log(fRes);
      });
    });
  }
});
