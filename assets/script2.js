const apiKey = "0ac4aa7b6f2b871c17671fb3f1fe4825";

var cityInput = $("#cityInput");

var searchButton = $("#searchButton");
var searchHistory = $("#searchHistory");
var cityName = $("#cityName");
var cityDate = $("#cityDate");

var weatherPic = $("#weatherPic");

var temp = $("#temp");
var wind = $("#wind");
var humidity = $("#humidity");
var UVIndex = $("#UVIndex");

var forecast = $("#forecast");

var currentDate = new Date();
var year = String(currentDate.getFullYear());
var month = String(currentDate.getMonth()+1);
var day = String(currentDate.getDate());
var currentDate = `${month}/${day}/${year}`;

renderHistory();

searchButton.on("click", function(r){
    r.preventDefault();
    if(cityInput.val() === ""){
        window.alert("Please enter a city");
        return;
    }
    getWeather(cityInput.val());
})

$(document).on("click", "#clickHistory", function(){
    getWeather($(this).text());
})

function getWeather(object){
    var mainURL = `https://api.openweathermap.org/data/2.5/weather?q=${object}&APPID=${apiKey}`;

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
            cityWeatherPic: data.weather[0].icon
        }
    
    var UVURL = `https://api.openweathermap.org/data/2.5/uvi?lon=${cityDisplay.cityUVIndex.lon}&lat=${cityDisplay.cityUVIndex.lat}&appid=${apiKey}`
    $.ajax({
        url: UVURL,
        method: 'GET'
    })
    .then(function(uvStuff){
        var historyList = [];
        var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
        renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, cityDisplay.cityWeatherPic);
        renderHistory(cityDisplay.name);
    })
    })
}

function renderWeather(name, cityTemp, cityWind, cityHumidity, cityUVIndex, cityWeatherPic){
    cityName.text(name);
    cityDate.text(`${currentDate}`);
    temp.text(`Temp: ${Math.floor(((cityTemp-273.15)*1.8 + 32))} °F`);
    wind.text(`Wind: ${cityWind} MPH`);
    humidity.text(`Humidity: ${cityHumidity} %`);
    UVIndex.text(`UV Index: ${cityUVIndex}`);
    weatherPic.attr("src", cityWeatherPic);
}


function renderHistory(name){
    searchHistory.empty()

    var historyList = JSON.parse(localStorage.getItem("searchHistory"));
    for(i=0;i<historyList.length;i++){
        var newHistoryItem = $("<li>").attr("id", "clickHistory");
        newHistoryItem.text(historyList[i]);
        searchHistory.append(newHistoryItem);
    }
}