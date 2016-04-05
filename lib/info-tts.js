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
 */

'use strict';

var fs = require('fs');
var request = require('request');
var path = require('path');
// var Player = require('player');
var Clock = require('./Clock.js');
var Weather = require('./WundergroundWeather.js');

let Afplay = require('afplay');

// Instantiate a new player
// let player = new Afplay;


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
	//*
	var player;
	var playlist = text.split('. ');
	var startSequence;
	var p = new Promise((resolve, reject) => {
		startSequence = resolve;
	});

	p = p.then(function() {
		return (new Afplay()).play(path.join(__dirname, '../mp3/chime.mp3'));
	});

	playlist = playlist.map(function(sentence, index) {
		console.log('Sentence:', sentence);
		sentence = encodeURIComponent(sentence);
		var mp3url = 'https://translate.google.com/translate_tts?tl=vi&client=tw-ob&ie=UTF-8&ttsspeed=1.5&q=' + sentence;
		return {
			text: sentence,
			url: mp3url,
			path: path.join(__dirname, '../mp3/sentence' + index + '.mp3')
		};
	});

	// console.log('Playlist:', playlist);
	var count = 0;
	var playCount = 0;
	for (var i = 0; i < playlist.length; i++) {
		// delete local file
		try {
			fs.unlinkSync(playlist[i].path);
		} catch (err) {
			console.log('File note existed to delete', playlist[i].path +'.', 'Skipping');
		}

		request.get(playlist[i].url)
			.on('response', function(index, response) {
				count ++;

				console.log(index, response.statusCode, playlist[index].url);

				if (index === 0) {
					console.log('get the first mp3, let\'s play. The rest will be loaded in background');
					startSequence('start');
				}
			}.bind(this, i))
			.pipe(fs.createWriteStream(playlist[i].path));

		p = p.then(function() {
			var index = playCount;
			playCount ++;
			console.log('Play', playlist[index].path);
			return (new Afplay()).play(playlist[index].path);
		});
	}
	// when all is played
	p.then(() => {
		console.log('Play completed');
	});

	// player = new Afplay();
	// player.play(localFiles[0])
	// 	.then(() => {
	// 		console.log('done');
	// 	})
	// 	.catch(error => {
	// 		console.log('Error playing file');
	// 	});

	// player.on('downloading', function(song) {
	// 		console.log('downloading', song);
	// 	})
	// 	.on('playing', function(song) {
	// 		console.log('im playing... ', song);
	// 	})
	// 	.on('playend',function(item){
	// 		// return a playend item
	// 		console.log('src:' + item + ' play done, switching to next one ...');
	// 	})
	// 	.on('error', function(err) {
	// 		console.log('player error:', err);
	// 		// when error occurs, use the OSX native TTS
	// 		// runCmd(
	// 		// 	'say',
	// 		// 	['-v', 'Vicki', '"' + text + '"'],
	// 		// 	function(resp) {
	// 		// 		console.log(resp);
	// 		// 		console.log('Speaking ended!');
	// 		// 	});
	// 	});
		// .play();
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

function playPlaylist() {

}

/**
 * [composeInfoString description]
 * @param  {Weather} weather The weather object wrapper
 * @return {String}         text to speak
 */
function composeInfoString(weather, clock) {
	var text = '';
	var nextHourCondition = '';

	text += 'Bây giờ là ' + clock.getCurrentHourString() + '. ';

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
