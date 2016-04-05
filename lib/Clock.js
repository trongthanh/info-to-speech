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

Clock.prototype = {
	constructor: Clock,

	getCurrentHourString: function() {
		var now = new Date();
		return now.getHours() + ' giờ';
	}
};

module.exports = Clock;
