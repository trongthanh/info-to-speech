/*
 *
 * http://naustud.io
 *
 * Copyright (c) 2014-2016 Thanh Tran
 * Licensed under the MIT license.
 * OpenWeather is not used since it doesn't support next hour forecast
 * I'm using WundergroundWeater for now. Please obtain an API key for your own app
 */

'use strict';
let fs = require('fs');
let request = require('request');
let path = require('path');
let Clock = require('./Clock.js');
let Weather = require('./WundergroundWeather.js');

let Afplay = require('afplay');


function collectInfo() {
	let clock = new Clock();
	let weather = new Weather();

	weather.getHourlyWeather(function() {
		let text = composeInfoString(weather, clock);
		console.log('Text to speak:', text);

		getSpeechMp3(text, weather);
	});
}


function getSpeechMp3(text, weather) {
	let playlist = text.split('. ');
	let startSequence;
	let p = new Promise((resolve/*, reject*/) => {
		startSequence = resolve;
	});

	p = p.then(function() {
		return (new Afplay()).play(path.join(__dirname, '../mp3/chime-open.mp3'));
	});

	playlist = playlist.map(function(sentence, index) {
		console.log('Sentence:', sentence);
		let mp3url = 'https://translate.google.com/translate_tts?tl=vi&client=tw-ob&ie=UTF-8&ttsspeed=1&q=' + encodeURIComponent(sentence);
		return {
			text: sentence,
			url: mp3url,
			path: path.join(__dirname, '../mp3/sentence' + index + '.mp3')
		};
	});

	// use temperature info to decide cutscene music
	var temperature = weather.feelLikeTemp() || weather.temp();
	console.log('temperature:', temperature);

	// console.log('Playlist:', playlist);
	/*eslint no-loop-func:0*/
	for (let i = 0; i < playlist.length; i++) {
		// delete local file
		try {
			fs.unlinkSync(playlist[i].path);
		} catch (err) {
			console.log('File note existed to delete', playlist[i].path + '.', 'Skipping');
		}

		request.get(playlist[i].url)
			.on('response', ((index, response) => {
				console.log(index, response.statusCode, playlist[index].url);

				if (index === 0) {
					console.log('Got the first mp3, play immediately. The rest will be loaded in background');
					startSequence('start');
				}
			}).bind(this, i))
			.pipe(fs.createWriteStream(playlist[i].path));

		// chain the player into a sequence
		p = p.then(((index) => {
			console.log('Play', playlist[index].path);
			return (new Afplay()).play(playlist[index].path);
		}).bind(this, i));

		if (playlist[i].text.indexOf('cảm giác như') !== -1) {
			// insert the music cutscene
			if (temperature >= 35) {
				let rand = getRandomInt(1, 5);
				console.log('Insert the hot temperature music cutscene no', rand);
				p = p.then(function() {
					return (new Afplay()).play(path.join(__dirname, '../mp3/hot' + rand + '.mp3'));
				});
			}
		}
	}

	p = p.then(function() {
		return (new Afplay()).play(path.join(__dirname, '../mp3/chime-close.mp3'));
	});

	// when all is played
	p.then(() => {
		console.log('Play completed');
	});
}


/**
 * [composeInfoString description]
 * @param  {Weather} weather The weather object wrapper
 * @param  {Clock} clock The clock object
 * @return {String}         text to speak
 */
function composeInfoString(weather, clock) {
	let text = '';
	let nextHourCondition = '';
	let currentHour = clock.getCurrentHour();

	text += 'Bây giờ là ' + clock.getCurrentHourString() + '. ';

	if (currentHour === 12) {
		text += 'Đã đến giờ ăn trưa. ';
	} else if (currentHour === 18) {
		text += 'Đã đến giờ vào hồ bơi. ';
	}

	text += 'Nhiệt độ bên ngoài là ' + weather.temp() +  ' độ';


	if (weather.feelLikeTemp()) {
		text += ', cảm giác như ' + weather.feelLikeTemp() +  ' độ. ';
	} else {
		text += '. ';
	}

	if (weather.humidity() >= 80) {
		text += 'Độ ẩm là ' + weather.humidity() + ' phần trăm, ';
	}
	if (weather.windSpeed() >= 20) {
		text += 'tốc độ gió là ' + weather.windSpeed() + ' km/h, ';
	}
	text += 'Thời tiết hiện tại là ' + weather.mainCondition() + '. ';

	nextHourCondition = weather.nextHourCondition();
	if (nextHourCondition) {
		text += 'Thời tiết của giờ tiếp theo là ' + nextHourCondition;
	}

	return text;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// function runCmd(cmd, args, callBack ) {
// 	let spawn = require('child_process').spawn;
// 	let child = spawn(cmd, args);
// 	let resp = '';

// 	child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
// 	child.stdout.on('end', function() { callBack (resp); });
// } // ()



exports.speak = function() {
	collectInfo();
	// return getSpeechMp3('Current temperature is 33 degree Celsius. Humidity is 52 percent. Weather condition is broken clouds');
};
