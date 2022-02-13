# Weather Report
LINK:
https://sonnytedesco26.github.io/weather-report/

For this project, the goal was to create a Weather Dashboard which would display the weather for the current day + 5 next days based on user input. This required the OpenWeather API to be called to load the data.

## Inital Page

![emptyWeather](/assets/images/emptyWeather.png)

The user is presented with the search by city, and empty stats for the weather. The 5 day cards for the future forecast will not show up if nothing is entered. If a user attempts to press the 'Search' button without entering anything, an alert will yell at them to enter a name.

## Loaded Page

![WeatherCallExample](/assets/images/WeatherCallExample.png)

When entering a city, the data for the current day is displayed in the big card to the right. This info, unlike the 5 day forecast, also includes the UV index, which changes based on how severe it is (Red for severe, grey for moderate, and green for good). Each search will be listed below search button, where the user will be able to click on each one to revisit their past forecast searches. There is also a 'Clear History' button, where the localStorage is emptied and the page goes back to blank. With the 5 day forecast, there was initially an issue where more than just 5 days would be returned from the API. Upon further examination, it became clear that each day was having numerous JSONs returned for it, all weather stats changing based on time of day. This issue was resolved by placing an if statement right after the for loop, making sure that no single day was repeated twice. The datefield had to be reformatted from the original API, as well as the temperature (given in Kelvin).



