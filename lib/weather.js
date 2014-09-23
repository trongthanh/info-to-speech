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

	getTemperature: function() {
		return this.rawObj.main.temp;
	},

	getHumidity: function() {
		return this.rawObj.main.humidity;
	},

	getMainCondition: function() {
		return this.rawObj.weather[0].description;
	}
};


exports.Weather = Weather;