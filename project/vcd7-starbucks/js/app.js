// Dummy session object
var sessionDummy = {
	purchasedItems : []
};

// User signed in
var baristaName = "John Appleseed";


// Display time
function displayInfobox() {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var currentDatetime = new Date();

	// Display month + date
	$(".js-date")[0].innerHTML = months[currentDatetime.getMonth()] + " " + currentDatetime.getDate();

	// Set "Good morning/afternoon/evening"
	var hour = currentDatetime.getHours();
	$(".js-time-desc")[0].innerHTML =
		hour >= 6 && hour < 12 ? "morning" :
		hour >= 12 && hour < 18 ? "afternoon" :
		"evening";

	// Display actual hour:minute
	var hourSuffix = hour - 12 < 0 ? "AM" : "PM";
	hour = hour % 12 == 0 ? 12 : hour % 12;

	$(".js-time")[0].innerHTML = hour + ":" + currentDatetime.getMinutes() + " " + hourSuffix;

	// Change barista name
	$(".js-preferred-name")[0].innerHTML = baristaName;
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

	// Display infobox contents, and schedule infobox refresh
	displayInfobox();
	setInterval(displayInfobox, 10000);

});