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
//Month starts at 0 index
var month = String(currentDate.getMonth() + 1);
var day = String(currentDate.getDate());
var currentDate = `${month}/${day}/${year}`;
//Checks to see if local history is empty
if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
    console.log("searchHistory empty")
} else {
    renderHistory();
}

searchButton.on("click", function(r) {
    //prevents scary localstorage stuff
    r.preventDefault();
    //yells at user for leaving input empty
    if (cityInput.val() === "") {
        window.alert("Please enter a city");
        return;
    }
    //sets value for the city input, and calls the getweather function
    getWeather(cityInput.val());
})

clearButton.on("click", function() {
    localStorage.clear();
    renderHistory("");
})
//lets user click elements from history to recall the getweather function
$(document).on("click", "#clickHistory", function() {
    getWeather($(this).text());
})

function getWeather(object) {
    var mainURL = `https://api.openweathermap.org/data/2.5/weather?q=${object}&APPID=${apiKey}`;

    $.ajax({
            url: mainURL,
            method: "GET"
        })
        .then(function(data) {
            var cityDisplay = {
                name: data.name,
                cityTemp: data.main.temp,
                cityWind: data.wind.speed,
                cityHumidity: data.main.humidity,
                cityUVIndex: data.coord,
                //more than one weather returned, so only take the first img 
                cityWeatherPic: data.weather[0].icon
            }
            // UV Index needed different URL for API
            var UVURL = `https://api.openweathermap.org/data/2.5/uvi?lon=${cityDisplay.cityUVIndex.lon}&lat=${cityDisplay.cityUVIndex.lat}&appid=${apiKey}`
            $.ajax({
                    url: UVURL,
                    method: 'GET'
                })
                .then(function(uvStuff) {
                    //checks to see if search history is completely empty
                    if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
                        var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                        var historyList = [];
                            //add city to list, set in local storage, and render the Weather/History
                            historyList.push(cityDisplay.name);
                            localStorage.setItem("searchHistory", JSON.stringify(historyList));
                            renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                            renderHistory(cityDisplay.name);
                        

                    } else {
                        var historyList = JSON.parse(localStorage.getItem("searchHistory"));
                        var loadedWeatherPic = `https:///openweathermap.org/img/w/${cityDisplay.cityWeatherPic}.png`;
                        //checks to see if specific city is already in the search history
                        if (historyList.indexOf(cityDisplay.name) === -1) {
                            historyList.push(cityDisplay.name);
                            localStorage.setItem("searchHistory", JSON.stringify(historyList));

                            renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                            renderHistory(cityDisplay.name);
                        } else {
                            //if city already in history, no need to re-render the history
                            renderWeather(cityDisplay.name, cityDisplay.cityTemp, cityDisplay.cityWind, cityDisplay.cityHumidity, uvStuff.value, loadedWeatherPic);
                        }
                    }
                })

                function getForecast() {
                    //needed to empty out the last search (otherwise, 5 days will stack based on search)
                    forecast.empty();
                    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${object}&APPID=${apiKey}`;
                    $.ajax({
                        url: fiveDayURL,
                        method: "GET"
                    })
                    .then(function(fivedayForecast){
                        for(i=0; i< fivedayForecast.list.length; i++){
                            //API would return multiple entries for everyday (new stats every 3 hours), so if checks to see if the next entry in the loop has the same date
                            //Also, dates returned included time fields, so need substring to capture only YYYY-MM-DD
                            if(fivedayForecast.list[i].dt_txt.substring(0,10) != fivedayForecast.list[i+1].dt_txt.substring(0,10)){
                            var fivedayDisplay={
                                //needs to be i+1 to get it to be next day
                                date: fivedayForecast.list[i+1].dt_txt,
                                pic: fivedayForecast.list[i+1].weather[0].icon,
                                temp: fivedayForecast.list[i+1].main.temp,
                                wind: fivedayForecast.list[i+1].wind.speed,
                                humidity: fivedayForecast.list[i+1].main.humidity
                            }
                            var fivedayPic = `https:///openweathermap.org/img/w/${fivedayDisplay.pic}.png`;
                            createForecast(fivedayDisplay.date, fivedayPic, fivedayDisplay.temp, fivedayDisplay.wind, fivedayDisplay.humidity);
                       }
                        }
                    })
                
                }
                getForecast();
        })
}

function renderWeather(name, cityTemp, cityWind, cityHumidity, cityUVIndex, cityWeatherPic) {
    cityName.text(name);
    cityDate.text(`${currentDate}`);
    //temperature returned from API is kelvin
    temp.text(`Temp: ${Math.floor(((cityTemp-273.15)*1.8 + 32))} °F`);
    wind.text(`Wind: ${cityWind} MPH`);
    humidity.text(`Humidity: ${cityHumidity} %`);
    //Checks to see how severe the UVIndex is, then sets the class depending on the severity
    if(cityUVIndex >=0 && cityUVIndex < 3){
        $("#UVIndex").attr("class", "UVGood")
        UVIndex.text(`UV Index: ${cityUVIndex}`);
    } else if (cityUVIndex >=3 && cityUVIndex < 7){
        $("#UVIndex").attr("class", "UVNormal")
        UVIndex.text(`UV Index: ${cityUVIndex}`);
    } else if (cityUVIndex >= 7){
        $("#UVIndex").attr("class", "UVTrash")
        UVIndex.text(`UV Index: ${cityUVIndex}`);
    }
    //UVIndex.text(`UV Index: ${cityUVIndex}`);
    weatherPic.attr("src", cityWeatherPic);
}

function createForecast(date, pic, temp, wind, humidity) {
    var forecastFiveDay = $("<div>").attr("id", "forecastFiveDay");
    var forecastDate = $("<h3>");
    var forecastPic = $("<img>");
    var forecastTemp = $("<p>");
    var forecastWind = $("<p>");
    var forecastHumid = $("<p>");

    //appens div to have the following elements displayed
    forecast.append(forecastFiveDay);
    forecastDate.text(date.substring(0,10));
    forecastPic.attr("src", pic);
    forecastTemp.text(`Temp: ${Math.floor(((temp-273.15)*1.8 + 32))} °F`);
    forecastWind.text(`Wind: ${wind} MPH`);
    forecastHumid.text(`Humidity: ${humidity} %`);

    forecastFiveDay.append(forecastDate, forecastPic, forecastTemp, forecastWind, forecastHumid);
}

function renderHistory(name) {
    pastSearches.empty()

    var historyList = JSON.parse(localStorage.getItem("searchHistory"));
    for (i = 0; i < historyList.length; i++) {
        var newHistoryItem = $("<div>").attr("id", "clickHistory");
        newHistoryItem.text(historyList[i]);
        //add new entries to top of the list
        pastSearches.prepend(newHistoryItem);
    }
}