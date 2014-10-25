
// Display time
function displayDatetime() {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var currentDatetime = new Date();
	var hour = currentDatetime.getHours();
	var hourSuffix = hour - 12 < 0 ? "AM" : "PM";
	hour = hour % 12 == 0 ? 12 : hour % 12;

	$(".js-date")[0].innerHTML = months[currentDatetime.getMonth()] + " " + currentDatetime.getDate();
	$(".js-time")[0].innerHTML = hour + ":" + currentDatetime.getMinutes() + " " + hourSuffix;
}

// ================
//  Document Ready
// ================
$(document).ready(function () {

	// Replace all @2x images
	if (window.devicePixelRatio == 2) {
		var images = $("img.js-2x-img");
		for (var i = 0; i < images.length; ++i) {
			
			// Append "@2x" into image name
			var imageType = images[i].src.substr(-4);
			var imageName = images[i].src.substr(0, images[i].src.length - 4);
			imageName += "@2x" + imageType;

			// Reassign image source
			images[i].src = imageName;
		}
	}

	// Display time, and schedule time refresh
	displayDatetime();
	setInterval(displayDatetime, 10000);

});