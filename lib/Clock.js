/* © 2014 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 *
 */
'use strict';

/**
 * Clock class
 * Getting clock info
 * @constructor
 */
function Clock() {
	//empty
}

var weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

Clock.prototype = {
	constructor: Clock,

	getCurrentHourString: function() {
		var now = new Date();
		return now.getHours() + ' giờ';
	},

	getCurrentHour() {
		var now = new Date();
		return now.getHours();
	},

	getWeekDay() {
		var now = new Date();
		return weekDays[now.getDay()];
	}
};

module.exports = Clock;
