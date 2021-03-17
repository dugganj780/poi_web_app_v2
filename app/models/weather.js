'use strict'
const fetch = require("node-fetch");

const Weather = {
    async getWeatherInfo(lat, long){
        const API = "979ff9585ac147c62cce65ca76081689";
        let response = await fetch("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+API);
        let weather = await response.json()

        const weatherInfo = {
            weather: weather.weather[0].main,
            temp: Math.round(weather.main.temp - 273.15) + "\u00B0C",
            feelTemp: Math.round(weather.main.feels_like - 273.15) + "\u00B0C",
            windspeed: weather.wind.speed + "km/hr",
        }
        return weatherInfo

    }

}

module.exports = Weather;