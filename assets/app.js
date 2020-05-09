var APIid = "987370c9088242014b673e9c345ee3d9";

$(document).ready(function () {
  $("#btnSearch").on("click", function (e) {
    e.preventDefault();
    var citySearch = $("#citySearch").val();

    //City Temp
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&appid=${APIid}&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);
      kelvin = res.main.temp_max;
      $("#weather-display").prepend(`<h1>The temperature is ${kelvin} *F</h1>`);
    });
  });
});
