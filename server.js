
const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();

const cors = require('cors');
const fs = require('fs');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    const sendData = { location: "Location", temp: "Temp", description: "Description", feel: "Feel", humidity: "Humidity", speed: "Speed" };

    res.render('index', { sendData: sendData });
});

app.post("/", async (req, res) => {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await fetch(url);
    const weatherData = await response.json();
    console.log(weatherData);
    const temp = Math.floor(weatherData.main.temp);
    const description = weatherData.weather[0].description;
    const sendData = {};
    sendData.temp = temp;
    sendData.description = description;
    sendData.location = location;
    res.render('index', { sendData: sendData });

})
app.listen(3000, () => {
    console.log("Server is running...")
});