const apiKey = "0ac4aa7b6f2b871c17671fb3f1fe4825";

var cityInput = $("#cityInput");

var searchButton = $("#searchButton");
var searchHistory = $("#searchHistory");
var cityName = $("#cityName");
var cityDate = $("#cityDate");

var weatherPic = $("#weatherPic");

var temp = $("#temp");
var wind = $("#wind");
var humidity = $("humidity");
var UVIndex = $("UVIndex");

var forecast = $("forecast");

var currentDate = new Date();
var year = String(currentDate.getFullYear());
var month = String(currentDate.getMonth()+1);
var day = String(currentDate.getDate());
var currentDate = `${month}/${day}/${year}`;

searchButton.on("click", function(r){
    r.preventDefault();
    if(cityInput.value === ""){
        window.alert("Please enter a city");
        return;
    }
    getWeather(cityInput.value);
})

function getWeather(object){
    var mainURL = `https://api.openweathermap.org/data/2.5/weather?q=${object}&appid=${apiKey}`;

    $.ajax({
        url: mainURL,
        method: "GET"
    })
    .then(function(data){
        var cityDisplay = {
            name: data.name,
            cityTemp: data.main.temp,
            cityWind: data.wind.speed,
            cityHumidity: data.main.humidity,
            cityUVIndex: data.coord,
            cityWeatherIcon: data.weather.icon
        }
    })
}

function renderWeather(name, cityTemp, cityWind, cityHumidity, cityUVIndex, cityWeatherPic){
    cityName.text(name);
    cityDate.text(`${currentDate}`);
    temp.text(`Temp: ${cityTemp} °F`);
    wind.text(`Wind: ${cityWind} MPH`);
    humidity.text(`Humidity: ${cityHumidity} %`);
    UVIndex.text(`UV Index: ${cityUVIndex}`);
    weatherPic.attr("src", cityWeatherPic);
}

