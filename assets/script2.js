const apiKey = "0ac4aa7b6f2b871c17671fb3f1fe4825";

var cityInput = $("#cityInput");

var searchButton = $("#searchButton");
var clearButton = $("#clearButton");
var pastSearches = $("#pastSearches");
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

if(JSON.parse(localStorage.getItem("searchHistory")) == null){
    console.log("searchHistory empty")
}else{
renderHistory();
}

searchButton.on("click", function(r){
    r.preventDefault();
    if(cityInput.val() === ""){
        window.alert("Please enter a city");
        return;
    }
    getWeather(cityInput.val());
})

clearButton.on("click", function(){
    localStorage.clear();
    renderHistory("");
})

$(document).on("click", ".clickHistory", function(){
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
        if(JSON.parse(localStorage.getItem("searchHistory")) == null){
            var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
            var historyList = [];
            //if city name not present in list
            if(historyList.indexOf(cityDisplay.name) === -1){
                //var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                historyList.push(cityDisplay.name);
                localStorage.setItem("searchHistory", JSON.stringify(historyList));
                renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                renderHistory(cityDisplay.name);
            }else{
                //var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
            }
        
            } else{
                var historyList = JSON.parse(localStorage.getItem("searchHistory"));
                var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                if(historyList.indexOf(cityDisplay.name) === -1){

                    historyList.push(cityDisplay.name);
                    localStorage.setItem("searchHistory", JSON.stringify(historyList));

                    renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                    renderHistory(cityDisplay.name);
                } else{
                    //var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                    renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                }
        }
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
    pastSearches.empty()

    var historyList = JSON.parse(localStorage.getItem("searchHistory"));
    for(i=0;i<historyList.length;i++){
        var newHistoryItem = $("<div>").attr("class", "clickHistory");
        newHistoryItem.text(historyList[i]);
        pastSearches.prepend(newHistoryItem);
    }
}