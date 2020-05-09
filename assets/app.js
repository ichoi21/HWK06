$(document).ready(function () {
  init();

  function init() {
    WeatherLook();
    $("#5Dforecast").hide();
    $("#history").hide();
    clearHistory();
    clickHistory();
    displayHistory();
  }

  var citySearch;
  var APIid = "&appid=987370c9088242014b673e9c345ee3d9";
  var units = "&units=imperial";
  // var cnt = "&cnt=5";
  var API = "https://api.openweathermap.org/data/2.5/";
  var searchHistoryArr = [];

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
      $("#5Dforecast").show();
      var res = response;
      console.log(res);
      // console.log((temp = Math.floor(res.main.temp)));
      var name = res.name;
      var date = new Date(res.dt * 1000).toLocaleDateString("en-US");
      var icon = res.weather[0].icon;
      var weather = res.weather[0].description;
      var temp = Math.floor(res.main.temp);
      var humidity = res.main.humidity;
      var windSpeed = res.wind.speed;
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      var countryCode = res.sys.country;

      localHistory(name);

      $("#cityName").text(name + " (" + date + ") ");
      $("#icon").attr(
        "src",
        "http://openweathermap.org/img/wn/" + icon + ".png"
      );
      $("#weather").html("<b>Description: </b>" + weather);
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
        url: API + "forecast?q=" + name + "," + countryCode + units + APIid,
        dataType: "json",
      }).then(function (forecastResponse) {
        console.log(forecastResponse);
        var fRes = forecastResponse;
        var fArr = [];

        for (var i = 0; i < 40; i += 8) {
          var fObj = {};
          var fResDate = fRes.list[i].dt_txt;
          var fDate = new Date(fResDate).toLocaleDateString("en-US");
          var fTempl = fRes.list[i].main.temp_min;
          var fTemph = fRes.list[i].main.temp_max;
          var fHumidity = fRes.list[i].main.humidity;
          var fIcon = fRes.list[i].weather[0].icon;

          fObj["list"] = {};
          fObj["list"]["date"] = fDate;
          fObj["list"]["temp_min"] = fTempl;
          fObj["list"]["temp_max"] = fTemph;
          fObj["list"]["humidity"] = fHumidity;
          fObj["list"]["icon"] = fIcon;

          fArr.push(fObj);
        }

        for (var j = 0; j < 6; j++) {
          var fArrDate = fArr[j].list.date;
          var fIconURL =
            "http://openweathermap.org/img/wn/" + fArr[j].list.icon + ".png";
          var fArrTempl = Math.floor(fArr[j].list.temp_min);
          var fArrTemph = Math.floor(fArr[j].list.temp_max);
          var fArrHumidity = fArr[j].list.humidity;

          $("#d-" + (j + 1)).text(fArrDate);
          $("#img-" + (j + 1)).attr("src", fIconURL);
          $("#t-" + (j + 1)).text(
            "Temp: " +
              Math.floor(fArrTempl) +
              " °F/" +
              Math.floor(fArrTemph) +
              " °F"
          );
          $("#hum-" + (j + 1)).text("Humidity: " + fArrHumidity + "%");
        }
        console.log(fRes);
      });
    });
  }

  function localHistory(citySearchName) {
    var searchHistoryObj = {};

    if (searchHistoryArr.length === 0) {
      searchHistoryObj["city"] = citySearchName;
      searchHistoryArr.push(searchHistoryObj);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
    } else {
      var checkHistory = searchHistoryArr.find(
        ({ city }) => city === citySearchName
      );

      if (searchHistoryArr.length < 5) {
        if (checkHistory === undefined) {
          searchHistoryObj["city"] = citySearchName;
          searchHistoryArr.push(searchHistoryObj);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistoryArr)
          );
        }
      } else {
        if (checkHistory === undefined) {
          searchHistoryArr.shift();
          searchHistoryObj["city"] = citySearchName;
          searchHistoryArr.push(searchHistoryObj);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistoryArr)
          );
        }
      }
    }
    $("#search-history").empty();
    displayHistory();
  }

  function displayHistory() {
    var getLocalSearchHistory = localStorage.getItem("searchHistory");
    var localSearchHistory = JSON.parse(getLocalSearchHistory);

    if (getLocalSearchHistory === null) {
      createHistory();
      getLocalSearchHistory = localStorage.getItem("searchHistory");
      localSearchHistory = JSON.parse(getLocalSearchHistory);
    }

    for (var i = 0; i < localSearchHistory.length; i++) {
      var historyLi = $("<li>");
      historyLi.addClass("list-group-item");
      historyLi.text(localSearchHistory[i].city);
      $("#search-history").prepend(historyLi);
      $("#history").show();
    }
    return (searchHistoryArr = localSearchHistory);
  }

  function createHistory() {
    searchHistoryArr.length = 0;
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
  }

  function clearHistory() {
    $("#btnClear").on("click", function () {
      $("#search-history").empty();
      $("#history").hide();
      localStorage.removeItem("searchHistory");
      createHistory();
    });
  }

  function clickHistory() {
    $("#search-history").on("click", "li", function () {
      var cityNameHistory = $(this).text();
      getWeather(cityNameHistory);
    });
  }
});
