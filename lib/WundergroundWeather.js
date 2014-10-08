/* © 2014 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 */
'use strict';
var request = require('request');

/**
 * Weather class
 * Wrapping openweather's info object for convenience
 * @param {[type]} weatherInfo [description]
 */
function WundergroundWeather(weatherInfo) {

	this.rawObj = weatherInfo;
}

WundergroundWeather.prototype = {
	constructor: WundergroundWeather,
	rawObj: null,
	rawHourlyArr: null,

	getCurrentWeather: function(callback) {
		var _this = this;
		var hour = new Date();
		hour.setMinutes(0, 0, 0); //roud it up to hours

		request.get(
			'http://api.wunderground.com/api/33c9addcc118e257/geolookup/conditions/forecast/q/Vietnam/Ho_Chi_Minh.json?hours=' + hour,
			function(error, response, body) {
				if (!error && response.statusCode === 200) {
					// console.log(body); // Print the response
					_this.rawObj = JSON.parse(body).current_observation;

					if (callback) { callback(_this); }
				}
			}
		);
	},

	getHourlyWeather: function(callback) {
		var _this = this;
		var hour = new Date();
		hour.setMinutes(0, 0, 0); //roud it up to hours

		request.get(
			'http://api.wunderground.com/api/33c9addcc118e257/geolookup/conditions/hourly/q/Vietnam/Ho_Chi_Minh.json?hours=' + hour,
			function(error, response, body) {
				var jsonBody;
				if (!error && response.statusCode === 200) {
					jsonBody = JSON.parse(body);
					// console.log(body); // Print the response
					_this.rawObj = jsonBody.current_observation;
					_this.rawHourlyArr = jsonBody.hourly_forecast;

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
		return this.rawObj.temp_c;
	},

	/**
	 * Feel-like temperatue in Degree Celsius
	 * @return {Number} [description]
	 */
	feelLikeTemp: function() {
		return parseFloat(this.rawObj.feelslike_c);
	},

	/**
	 * Humidity in percentage
	 * @return {Number} [description]
	 */
	humidity: function() {
		return parseFloat(this.rawObj.relative_humidity); //raw value is in string, i.e "62%"
	},

	/**
	 * Weather description
	 * @return {String} [description]
	 */
	mainCondition: function() {
		return this.rawObj.weather;
	},

	/**
	 * Wind speed at km/h
	 * (Raw wind speed is in m/s)
	 * @return {Number} [description]
	 */
	windSpeed: function() {
		return this.rawObj.wind_kph;
	},

	/**
	 * Weather condition in next hour (forecast)
	 * @return {String} condition string
	 */
	nextHourCondition: function() {
		if (this.rawHourlyArr && this.rawHourlyArr[0]) {
			// first item in the array is next hour
			return this.rawHourlyArr[0].condition;
		} else {
			return '';
		}
	}
};


module.exports = WundergroundWeather;
