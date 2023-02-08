const express = require("express")
const cors = require("cors")
const axios = require("axios")
const dotenv = require("dotenv")
const app = express()

dotenv.config()

const weatherURL_city = `http://api.worldweatheronline.com/premium/v1/weather.ashx?num_of_days=14&format=json`

app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get("/weather", async (req, res) => {
	const { city } = req.query
	const { data } = await getWeather(city)
	const { weather } = data

	const parsedData = weather.map((day) => {
		return {
			sunset: day.astronomy[0].sunset,
			sunrise: day.astronomy[0].sunrise,
			date: day.date,
			maxTemp: day.maxtempC,
			minTemp: day.mintempC,
			uvIndex: day.uvIndex,
			iconURL: day.hourly[0].weatherIconUrl[0].value,
		}
	})

	res.json(parsedData)
})

function getWeather(city) {
	return axios
		.get(weatherURL_city, {
			params: {
				key: process.env.API_KEY_WEATHER,
				q: city,
			},
		})
		.then((response) => {
			return response.data
		})
		.catch((e) => {
			console.log(e)
		})
}

app.listen(4567)
