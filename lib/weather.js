/* © 2014 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 *
 */
'use strict';

/**
 * Weather class
 * Wrapping openweather's info object for convenience
 * @param {[type]} weatherInfo [description]
 */
function Weather(weatherInfo) {

	this.rawObj = weatherInfo;
}

Weather.prototype = {
	constructor: Weather,
	rawObj: null,

	/**
	 * Temperature in Degree Celsius
	 * @return {[type]} [description]
	 */
	getTemperature: function() {
		return this.rawObj.main.temp;
	},

	/**
	 * Humidity in percentage
	 * @return {[type]} [description]
	 */
	getHumidity: function() {
		return this.rawObj.main.humidity;
	},

	/**
	 * Weather description
	 * @return {[type]} [description]
	 */
	getMainCondition: function() {
		return this.rawObj.weather[0].description;
	},

	/**
	 * Wind speed at km/h
	 * (Raw wind speed is in m/s)
	 * @return {[type]} [description]
	 */
	getWindSpeed: function() {
		return this.rawObj.wind.speed * 3.6;
	}
};


exports.Weather = Weather;