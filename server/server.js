const express = require("express")
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))

// if api does not work
const weatherData = require("./example.json")

// const baseUrl = "https://api.openweathermap.org/data/2.5/onecall"
// const baseUrl = "https://api.openweathermap.org/data/2.5/weather"

app.get("/weather", (req, res) => {
	const { lat, lon } = req.query
	const exclude = "minutely,alerts"
	const units = "metric"
	const appid = process.env.API_KEY

	// axios
	// 	.get(
	// 		`${baseUrl}?lat={${lat}}&lon={${lon}}&exclude={${exclude}}&appid={${appid}}`
	// 	)
	// 	.then(({ data }) => {
	res.json({
		current: parseCurrentWeather(weatherData),
		daily: parseDailyWeather(weatherData),
		hourly: parseHourlyWeather(weatherData),
	})
	// })
	// .catch((e) => {
	// 	console.log(e)
	// 	res.sendStatus(500)
	// })
})

app.listen(3001, () => {
	console.log("listening on 3001")
})

function parseCurrentWeather({ current, daily }) {
	const { temp: currentTemp, weather, wind_speed } = current
	const { pop, temp, feels_like } = daily[0]

	return {
		currentTemp: Math.round(currentTemp),
		highTemp: Math.round(temp.max),
		lowTemp: Math.round(temp.min),
		highFeelsLike: Math.round(Math.max(...Object.values(feels_like))),
		lowFeelsLike: Math.round(Math.min(...Object.values(feels_like))),
		windSpeed: Math.round(wind_speed),
		precip: Math.round(pop * 100),
		icon: weather[0].icon,
		description: weather[0].description,
	}
}

function parseDailyWeather({ daily }) {
	return daily.slice(1).map((day) => {
		return {
			icon: day.weather[0].icon,
			timestamp: day.dt * 1000,
			temp: medium(Object.values(day.temp)),
		}
	})
}

const HOUR_IN_SECONDS = 3600
function parseHourlyWeather({ hourly, current }) {
	return hourly
		.filter((hour) => hour.dt > current.dt - HOUR_IN_SECONDS)
		.map((hour) => {
			return {
				timestamp: hour.dt * 1000,
				icon: hour.weather[0].icon,
				temp: Math.round(hour.temp),
				feelsLike: Math.round(hour.feels_like),
				windSpeed: Math.round(hour.wind_speed),
				pop: Math.round(hour.pop * 100),
			}
		})
}

function medium(arr) {
	return Math.round(
		arr.reduce((sum, next) => {
			return sum + next
		}, 0) / arr.length
	)
}
