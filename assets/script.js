const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const search = document.getElementById("search");
const clear = document.getElementById("clear");
var weatherToday = document.getElementById("weatherToday");
const currentPic = document.getElementById("currentPic");
const temp = document.getElementById("temp");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const UVIndex = document.getElementById("UVIndex");
var fiveDay = document.getElementById("fiveDay");
var forecast = document.getElementById("forecast")

var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

const apiKey = "0ac4aa7b6f2b871c17671fb3f1fe4825";

function newWeather(cityName){

    var URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    
    fetch(URL)
    .then(function(r){
        const year = moment().year();
        const month = moment().month();
        const day = moment().day();

        cityInput.innerHTML = r.data.name + "(" + month + "/" + day + "/" + year +")";
        var apiPic = r.data.weather.icon;
        currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + apiPic + ".png");
        currentPic.setAttribute("alt", r.data.weather.description);
        temp.innerHTML = "Temp: " + Math.floor(((r.data.main.temp)-273.15)*1.8 + 32) + "&#176F";
        wind.innerHTML = "Wind: " + r.data.wind.speed + "MPH";
        humidity.innerHTML = "Humidity: " + r.data.main.humidity + "%";

    })

    clear.addEventListener("click", function(){
        localStorage.clear();
        searchHistory = [];
    })
}
