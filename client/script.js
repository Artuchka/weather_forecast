import axios from "axios"
import { format } from "date-fns"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionError() {
	alert("There was an error! Please, allow to access to your geoposition!")
}
function positionSuccess({ coords }) {
	getWeather(coords.latitude, coords.longitude)
}

function getWeather(lat, lon) {
	axios
		.get("http://localhost:3001/weather", {
			params: {
				lat,
				lon,
			},
		})
		.then((res) => renderWeather(res.data))
		.catch((e) => {
			console.log(e)
			alert("error getting weather!")
		})
}

function renderWeather({ current, daily, hourly }) {
	document.body.classList.remove("blurred")
	renderCurrentWeather(current)
	renderDailyWeather(daily)
	renderHourlyWeather(hourly)
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
	currentIcon.src = getIconURL(current.icon, { large: true })
	setValue("temp", current.currentTemp)
	setValue("high", current.highTemp)
	setValue("low", current.lowTemp)
	setValue("fl-high", current.highFeelsLike)
	setValue("fl-low", current.lowFeelsLike)
	setValue("wind", current.windSpeed)
	setValue("precip", current.precip)
	setValue("description", current.description)
}

const dayilySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.querySelector("#day-card-template")
function renderDailyWeather(daily) {
	dayilySection.innerHTML = ""
	daily.forEach((day) => {
		const newDay = dayCardTemplate.content.cloneNode(true)

		setValue("temp", day.temp, { parent: newDay, extra: "" })
		setValue("date", formatDay(day.timestamp), { parent: newDay, extra: "" })
		newDay.querySelector("[data-icon]").src = getIconURL(day.icon)

		dayilySection.append(newDay)
	})
}

const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.querySelector("#hour-row-template")
function renderHourlyWeather(hourly) {
	hourlySection.innerHTML = ""
	hourly.forEach((hour) => {
		const newHour = hourRowTemplate.content.cloneNode(true)

		setValue("temp", hour.temp, { parent: newHour, extra: "" })
		setValue("fl", hour.feelsLike, { parent: newHour, extra: "" })
		setValue("wind", hour.windSpeed, { parent: newHour, extra: "" })
		setValue("pop", hour.pop, { parent: newHour, extra: "" })
		setValue("date", formatDay(hour.timestamp), { parent: newHour, extra: "" })
		setValue("hour", formatHour(hour.timestamp), {
			parent: newHour,
			extra: "",
		})

		newHour.querySelector("[data-icon]").src = getIconURL(hour.icon)

		hourlySection.append(newHour)
	})
}

function setValue(
	selector,
	value,
	{ parent = document, extra = "-current" } = {}
) {
	parent.querySelector(`[data${extra}-${selector}]`).textContent = value
}

function formatDay(timestamp) {
	return format(new Date(timestamp), "eeee")
}

function formatHour(timestamp) {
	return format(new Date(timestamp), "H")
}

function getIconURL(icon, { large = false } = {}) {
	const size = large ? "@2x" : ""
	return `http://openweathermap.org/img/wn/${icon}${size}.png`
}
