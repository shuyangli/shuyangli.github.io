/*
 * ===================
 *  Object Prototypes
 * ===================
 */

var protoSession = {
	currentDrinkSize : "",
	purchasedItems : [],
	netPrice : 0.0,
	taxPrice : 0.0,
	totalPrice : 0.0,
	addItem : function (item) {
		this.purchasedItems.push(item);
		purchasedItemsChanged();
	}
};


/*
	var newDrink = {
		itemType : "drink",
		itemSize : currentSession.currentDrinkSize,
		itemName : drinkName,
		itemCustomization : [],
		addCustomization : function (item) {
			this.itemCustomization.push(item);
			purchasedItemsChanged();
		}
	};
*/

/*
 * =======================
 *  Variable Declarations
 * =======================
 */ 

// Current session & last session
var currentSession = {};
var lastSession = {};

// User signed in
var baristaName = "John Appleseed";

// Tax rate
var taxRate = 0.07;

/*
 * ======================
 *  Model Helper Methods
 * ======================
 */

// Manual callback function for changes fired on purchased items
function purchasedItemsChanged() {
	var newPrice = 0.0;

	for (var i = 0; i < currentSession.purchasedItems.length; ++i) {
		// Loop through list of purchased Items, and calculate new total
		newPrice += lookupPrice(currentSession.purchasedItems[i]);

		if (currentSession.purchasedItems[i].itemType == "drink") {
			// If it's a drink, we also loop through its customizations
			for (var j = 0; j < currentSession.purchasedItems[i].itemCustomization.length; ++j) {
				newPrice += lookupPrice(currentSession.purchasedItems[i].itemCustomization[j]);
			}
		}
	}

	currentSession.netPrice = newPrice;
	currentSession.taxPrice = currentSession.netPrice * taxRate;
	currentSession.totalPrice = currentSession.netPrice + currentSession.taxPrice;

	displayChargePrice();
}

function lookupPrice(item) {

	if (item.itemType == "drink") {

	} else if (item.itemType == "customization") {

	} else if (item.itemType == "item") {

	} else if (item.itemType == "customPrice") {

	}

	// DRAGON: Fake implementation
	return 1.00;
}

function clearCurrentSession() {
	currentSession = jQuery.extend(true, {}, protoSession);
	resetOrderBarStatus();
}


/*
 * ===================
 *  UI Helper Methods
 * ===================
 */

// Display time
function displayInfobox() {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var currentDatetime = new Date();

	// Display month + date
	$(".js-date")[0].innerHTML = months[currentDatetime.getMonth()] + " " + currentDatetime.getDate();

	// Set "Good morning/afternoon/evening"
	var hour = currentDatetime.getHours();
	$(".js-time-desc")[0].innerHTML =
		(hour >= 6 && hour < 12) ? "morning" :
		(hour >= 12 && hour < 18) ? "afternoon" :
		"evening";

	// Display actual hour:minute
	var hourSuffix = hour - 12 < 0 ? "AM" : "PM";
	hour = (hour % 12 == 0) ? 12 : hour % 12;
	var minute = currentDatetime.getMinutes();
	minute = (minute < 10) ? "0" + minute : "" + minute;

	$(".js-time")[0].innerHTML = hour + ":" + minute + " " + hourSuffix;

	// Change barista name
	$(".js-preferred-name")[0].innerHTML = baristaName;
}

// Display tax or total
function displayTax(decimalVal) {
	var taxAmount = "$" + decimalVal.toFixed(2);
	$("#js-tax-dollar-amount-display")[0].innerHTML = taxAmount;
}

function displayTotal(decimalVal) {
	// Change charge button appearahce
	$("#charge-button").removeClass("js-charge-button-inactive").addClass("js-charge-button-active");

	// Change clear button appearance
	$("#clear-button").removeClass("js-clear-button-inactive").addClass("js-clear-button-active");

	// Change dollar amount
	var totalAmount = "$" + decimalVal.toFixed(2);
	$("#js-charge-prompt")[0].innerHTML = "Charge";
	$("#js-charge-dollar-amount-display")[0].innerHTML = totalAmount;
}

// Reset order button states
function resetOrderBarStatus() {
	// Change charge button appearance
	$("#charge-button").removeClass("js-charge-button-active").addClass("js-charge-button-inactive");

	// Change clear button appearance
	$("#clear-button").removeClass("js-clear-button-active").addClass("js-clear-button-inactive");

	// Change dollar amount
	$("#js-charge-prompt")[0].innerHTML = "Choose an Item";
	$("#js-charge-dollar-amount-display")[0].innerHTML = "";

	// Change tax amount
	displayTax(0.0);
}

// Display actual charge price
function displayChargePrice() {
	displayTax(currentSession.taxPrice);
	displayTotal(currentSession.totalPrice);
}

// Setup modal bindings
function setupModal() {

	// Close all dialogs when hit background
	$("#modal-overlay-background").on('click', resetModal);

	// Open drink dialog
	$("#short-button, #tall-button, #grande-button, #venti-button").on('click', function () {
		$("#modal-overlay").show();
		$("#modal-drink").show();

		// Change drink modal title
		var size = $(this).find(".item-button-label")[0].innerHTML;
		$(".js-modal-drink-size")[0].innerHTML = size;

		// Change session selected drink size
		currentSession.currentDrinkSize = size;
	});

	// Add drink to list of drinks
	$(".subitem-button").on('click', function() {

		if ($(this).attr("value") == "drink") {
			
			// If we're adding a drink, construct the drink with size and name
			var drinkName = $(this).find(".subitem-button-title")[0].innerHTML;
			var newDrink = {
				itemType : "drink",
				itemSize : currentSession.currentDrinkSize,
				itemName : drinkName,
				itemCustomization : [],
				addCustomization : function (item) {
					this.itemCustomization.push(item);
					purchasedItemsChanged();
				}
			};

			// And add into current session
			currentSession.addItem(newDrink);

		} else if ($(this).attr("value") == "customization") {

		} else if ($(this).attr("value") == "item") {

		} else if ($(this).attr("value") == "customPrice") {

		}
	});

	resetModal();
}

// Reset modal status
function resetModal() {
	$("#modal-overlay").children().hide();
	$("#modal-overlay").hide();
	$("#modal-overlay-background").show();
}

/*
 * =======================
 *  jQuery Document Ready
 * =======================
 */

$(document).ready(function () {

	// Replace all @2x images
	if (window.devicePixelRatio == 2) {
		$("img.js-2x-img").each(function (index, image) {
			// Append "@2x" into image name
			var imageType = image.src.substr(-4);
			var imageName = image.src.substr(0, image.src.length - 4);
			imageName += "@2x" + imageType;

			// Reassign image source
			image.src = imageName;
		});
	}

	// Setup modal status
	setupModal();

	// Display infobox contents, and schedule infobox refresh
	displayInfobox();
	setInterval(displayInfobox, 10000);

	// Setup new session
	clearCurrentSession();

	// Reset order bar button status
	resetOrderBarStatus();

	// Bind clear button click
	$("#clear-button").on('click', clearCurrentSession);
});