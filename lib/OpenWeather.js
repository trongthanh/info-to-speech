/* © 2014 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 *
 */
'use strict';
var request = require('request');

/**
 * Weather class
 * Wrapping openweather's info object for convenience
 * Currently hardcode to get Ho Chi Minh city conditions
 * @constructor
 */
function OpenWeather(weatherInfo) {
	if (weatherInfo) {
		this.rawObj = weatherInfo;
	}
}

OpenWeather.prototype = {
	constructor: OpenWeather,
	rawObj: null,

	getCurrentWeather: function(callback) {
		var _this = this;
		var hour = new Date();
		hour.setMinutes(0, 0, 0); //roud it up to hours

		request.get(
			'http://api.openweathermap.org/data/2.5/weather?id=1566083&units=metric&hours=' + hour,
			function(error, response, body) {
				if (!error && response.statusCode === 200) {
					// console.log(body); // Print the response
					_this.rawObj = JSON.parse(body);

					if (callback) { callback(_this); }
				}
			}
		);
	},

	/**
	 * Temperature in Degree Celsius
	 * @return {Number} [description]
	 */
	temp: function() {
		return this.rawObj.main.temp;
	},

	/**
	 * Feel-like temperatue in Degree Celsius
	 * (not available in OpenWeather)
	 * @return {Number} [description]
	 */
	feelLikeTemp: function() {
		return NaN;
	},

	/**
	 * Humidity in percentage
	 * @return {Number} [description]
	 */
	humidity: function() {
		return this.rawObj.main.humidity;
	},

	/**
	 * Weather description
	 * @return {String} [description]
	 */
	mainCondition: function() {
		return this.rawObj.weather[0].description;
	},

	/**
	 * Wind speed at km/h
	 * (Raw wind speed is in m/s)
	 * @return {Number} [description]
	 */
	windSpeed: function() {
		var rounded = (this.rawObj.wind.speed * 3.6).toFixed(1);
		return parseFloat(rounded);
	},

	/**
	 * Weather condition in next hour (forecast)
	 * @return {String} condition string
	 */
	nextHourCondition: function() {
		// not implemented
		return '';
	}
};

//fake method, to be implemented
OpenWeather.prototype.getHourlyWeather = OpenWeather.prototype.getCurrentWeather;


module.exports = OpenWeather;