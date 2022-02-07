const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityNames");
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

