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

// var Player = require('player');
var Clock = require('./Clock.js');
var Weather = require('./WundergroundWeather.js');


function collectInfo() {
	var clock = new Clock();
	var weather = new Weather();

	weather.getHourlyWeather(function() {
		var text = composeInfoString(weather, clock);
		console.log('Text to speak:', text);

		getSpeechMp3(text);
	});
}


function getSpeechMp3(text) {
	/*
	var player;
	var playlist = text.split('. ');

	playlist = playlist.map(function(sentence) {
		console.log('Sentence:', sentence);
		return 'http://translate.google.com/translate_tts?tl=en&q=' + sentence;
	});

	player = new Player(playlist);

	player.play(function(err, player) {
		console.log('play end!');
	});

	player.on('error', function(err) {
		console.log(err);
		// when error occurs, use the OSX native TTS
		runCmd(
			'say',
			['-v', 'Vicki', '"' + text + '"'],
			function(resp) {
				console.log(resp);
				console.log('Speaking ended!');
			});
	});
	/*/
	runCmd(
		'say',
		['-v', 'Vicki', '"' + text + '"'],
		function(resp) {
			console.log(resp);
			console.log('Speaking ended!');
		});
	//*/
}

/**
 * [composeInfoString description]
 * @param  {Weather} weather The weather object wrapper
 * @return {String}         text to speak
 */
function composeInfoString(weather, clock) {
	var text = '';
	var nextHourCondition = '';

	text += 'It\'s ' + clock.getCurrentHourString() + '. ';

	text += 'Outside temperature is ' + weather.temp() +  ' degree';
	if (weather.feelLikeTemp()) {
		text += ', feel like ' + weather.feelLikeTemp() +  ' degree. ';
	} else {
		text += '. ';
	}
	if (weather.humidity() >= 80) {
		text += 'Humidity ' + weather.humidity() + '%, ';
	}
	if (weather.windSpeed() >= 20) {
		text += 'wind speed ' + weather.windSpeed() + 'km/h, ';
	}
	text += 'Current condition is ' + weather.mainCondition() + '. ';

	nextHourCondition = weather.nextHourCondition();
	if (nextHourCondition) {
		text += 'Next hour condition is likely ' + nextHourCondition;
	}

	return text;
}


function runCmd(cmd, args, callBack ) {
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	var resp = '';

	child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
	child.stdout.on('end', function() { callBack (resp); });
} // ()



exports.speak = function() {
	collectInfo();
	// return getSpeechMp3('Current temperature is 33 degree Celsius. Humidity is 52 percent. Weather condition is broken clouds');
};
