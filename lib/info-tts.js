/*
 *
 * http://naustud.io
 *
 * Copyright (c) 2014 Thanh Tran
 * Licensed under the MIT license.
 *
 * Open weather API EXAMPLE:
 * Current weather of HCM city in metric units (ºC)
 * http://api.openweathermap.org/data/2.5/weather?id=1566083&units=metric
 * See current-weather.json for sample
 *
 */

'use strict';
var fs = require('fs');
var request = require('request');
var Weather = require('./weather.js').Weather;


function getCurrentWeather() {
	var weatherInfo;
	request.get(
		'http://api.openweathermap.org/data/2.5/weather?id=1566083&units=metric',
		function (error, response, body) {
			if (!error && response.statusCode === 200) {
				// console.log(body); // Print the response
				weatherInfo = new Weather(JSON.parse(body));
				var text = composeInfoString(weatherInfo);
				console.log('Text to speak:', text);
				runCmd(
					//'say -v Vicki "Current temperature is ' + weatherInfo.main.temp +  ' degree celsius"',
					'say',
					['-v', 'Vicki', '"' + text + '"'],
					function(resp) {
						console.log(resp);
						console.log('Speaking ended!');
					});
			}
		}
	);
}

function getSpeechMp3(text) {
	request
		.get('http://translate.google.com/translate_tts?tl=en&q=' + text)
		.pipe(fs.createWriteStream('speech.mp3'));
}

/**
 * [composeInfoString description]
 * @param  {Weather} weather THe weather object wrapper
 * @return {String}         text to speak
 */
function composeInfoString(weather) {
	var text = '';

	text += 'Current temperature is ' + weather.getTemperature() +  ' degree Celsius. ';
	text += 'Humidity is ' + weather.getHumidity() + ' percent. ';
	text += 'Weather condition is ' + weather.getMainCondition();

	return text;
}


function runCmd(cmd, args, callBack ) {
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	var resp = "";

	child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
	child.stdout.on('end', function() { callBack (resp); });
} // ()



exports.speak = function() {
	//return getCurrentWeather();
	return getSpeechMp3('Current temperature is 33 degree Celsius. Humidity is 52 percent. Weather condition is broken clouds');
};
