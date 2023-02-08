const axios = require("axios")
import { format } from "date-fns"

const form = document.querySelector("#settings")
const inputCityElement = form.querySelector("#city")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const city = inputCityElement.value
	getWeather(city)
})

function getWeather(city) {
	axios
		.get("http://localhost:4567/weather", {
			params: {
				city,
			},
		})
		.then(({ data }) => {
			console.log(data)
			updateWeather(data)
			removeBlur()
		})
		.catch((e) => {
			alert("error with server! please try again a bit later")
			console.log(e)
		})
}

const dayCardTemplate = document.querySelector("#dayCardTemplate")
const container = document.querySelector("#container")
function updateWeather(data) {
	container.innerHTML = ""
	data.forEach((day) => {
		const newDayCard = dayCardTemplate.content.cloneNode(true)

		newDayCard.querySelector("[data-icon]").src = day.iconURL
		setValue(newDayCard, "temp-max", day.maxTemp)
		setValue(newDayCard, "temp-min", day.minTemp)
		setValue(newDayCard, "sunset", day.sunset)
		setValue(newDayCard, "sunrise", day.sunrise)
		setValue(newDayCard, "date", formatDay(day.date))
		setValue(newDayCard, "uv", day.uvIndex)

		container.append(newDayCard)
	})
}

function setValue(parent, selector, value) {
	parent.querySelector(`[data-${selector}]`).textContent = value
}

function removeBlur() {
	document.querySelector("#outputWrapper").classList.remove("blurred")
}

function formatDay(date) {
	return format(new Date(date), "eeee")
}
