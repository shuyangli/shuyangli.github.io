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
	},
	removeItem : function (itemIndex) {
		this.purchasedItems.splice(itemIndex, 1);
		purchasedItemsChanged();
	}
};

var protoDrink = {
	itemType : "drink",
	itemSize : "",
	itemName : "",
	itemCustomization : [],
	addCustomization : function (item) {
		this.itemCustomization.push(item);
		purchasedItemsChanged();
	},
	removeCustomization : function (itemIndex) {
		this.itemCustomization.splice(itemIndex, 1);
		purchasedItemsChanged();
	},
	getItemDescription : function () {
		return this.itemSize + " " + this.itemName;
	}
};

var protoCustomization = {
	itemType : "customization",
	itemName : "",
	getItemDescription : function () {
		return this.itemName;
	}
}

var protoItem = {
	itemType : "item",
	itemName : "",
	getItemDescription : function () {
		return this.itemName;
	}
}

var protoCustomPrice = {
	itemType : "customPrice",
	itemName : "Custom Price",
	customItemPrice : 0,
	getItemDescription : function () {
		return this.itemName;
	}
}

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

// Price
var itemPriceData = {};
$.getJSON("js/item-prices.json", function (data) {
	itemPriceData = data;
});

// For modifying the list
var currentItemIndex = 0;
var currentCustomizationIndex = 0;

// For cell size
var itemCellSize = {
	width : 223,
	height : 64
};
var customizationCellSize = {
	width : 191,
	height : 32
};

/*
 * ======================
 *  Model Helper Methods
 * ======================
 */

// Rolling my own toFixed method
function myToFixed (number, precision) {
    return (Math.round(number * 100) / 100).toFixed(precision);
}

// Manual callback function for changes fired on purchased items
function purchasedItemsChanged() {

	// If there's no item, we reset everything
	if (currentSession.purchasedItems.length == 0) {
		clearCurrentSession();
		return;
	}

	// There's item; we hide the no item prompt
	$("#no-item-prompt").hide();

	// We first clean up the order list
	removeAllItemsFromOrderList();

	// Then loop through the list of purchased items
	var newPrice = 0.0;
	for (var i = 0; i < currentSession.purchasedItems.length; ++i) {

		// Calculate new total and display order list
		var currentItemPrice = lookupPrice(currentSession.purchasedItems[i]);
		var currentItemName = currentSession.purchasedItems[i].getItemDescription();

		newPrice += currentItemPrice;
		addItemIntoOrderList(currentItemName, currentItemPrice, i);

		if (currentSession.purchasedItems[i].itemType == "drink") {
			// If it's a drink, we also loop through its customizations
			for (var j = 0; j < currentSession.purchasedItems[i].itemCustomization.length; ++j) {
				var currentCustomizationPrice = lookupPrice(currentSession.purchasedItems[i].itemCustomization[j]);
				var currentCustomizationName = currentSession.purchasedItems[i].itemCustomization[j].getItemDescription();
				
				newPrice += currentCustomizationPrice;
				addCustomizationIntoOrderList(currentCustomizationName, currentCustomizationPrice, i, j);
			}
		}
	}

	currentSession.netPrice = newPrice;
	currentSession.taxPrice = currentSession.netPrice * taxRate;
	currentSession.totalPrice = currentSession.netPrice + currentSession.taxPrice;

	displayChargePrice();
}

function lookupPrice(item) {

	// Look up price in loaded JSON object
	if (item.itemType == "drink") {

		if (itemPriceData[item.itemType][item.itemSize].hasOwnProperty(item.itemName)) {
			return itemPriceData[item.itemType][item.itemSize][item.itemName];
		} else {
			return 0.33;
		}

	} else if (item.itemType == "customization") {

		if (itemPriceData[item.itemType].hasOwnProperty(item.itemName)) {
			return itemPriceData[item.itemType][item.itemName];
		} else {
			return 0.33;
		}

	} else if (item.itemType == "item") {

		if (itemPriceData[item.itemType].hasOwnProperty(item.itemName)) {
			return itemPriceData[item.itemType][item.itemName];
		} else {
			return 0.33;
		}

	} else if (item.itemType == "customPrice") {
		return item.customItemPrice;
	}

	// DRAGON: Fake implementation
	return 0.33;
}

function clearCurrentSession() {
	currentSession = $.extend(true, {}, protoSession);
	resetOrderBarStatus();
	resetOrderList();
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
	var taxAmount = "$" + myToFixed(decimalVal, 2);
	$("#js-tax-dollar-amount-display")[0].innerHTML = taxAmount;
}

function displayTotal(decimalVal) {
	// Change charge button appearahce
	$("#charge-button").removeClass("js-charge-button-inactive").addClass("js-charge-button-active");

	// Change clear button appearance
	$("#clear-button").removeClass("js-clear-button-inactive").addClass("js-clear-button-active");

	// Change dollar amount
	var totalAmount = "$" + myToFixed(decimalVal, 2);
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

// Remove all items in order list
function removeAllItemsFromOrderList() {
	$(".js-item-cell, .js-customization-cell").remove();
}

// Reset order list
function resetOrderList() {
	removeAllItemsFromOrderList();
	$("#no-item-prompt").show();
}

// Insert into order list
function addItemIntoOrderList(itemName, itemPrice, itemIndex) {
	$("#order-list").append(" \
		<div value=\"drink\" itemIndex=\"" + itemIndex + "\" class=\"js-item-cell shade-bottom\"> \
			<div class=\"js-item-name\">" + itemName + "</div> \
			<div class=\"js-item-price\">$" + myToFixed(itemPrice, 2) + "</div> \
		</div>");
}
function addCustomizationIntoOrderList(itemName, itemPrice, itemIndex, customizationIndex) {
	$("#order-list").append(" \
		<div value=\"customization\" itemIndex=\"" + itemIndex + "\" customizationIndex=\"" + customizationIndex + "\" class=\"js-customization-cell shade-bottom\"> \
			<div class=\"js-item-name vertical-align-text\">" + itemName + "</div> \
			<div class=\"js-item-price vertical-align-text\">$" + myToFixed(itemPrice, 2) + "</div> \
		</div>");
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
	$("#trenta-button").on('click', function () {

		$("#modal-overlay").show();
		$("#modal-drink-trenta").show();

		// Change session selected drink size
		var size = "Trenta"
		currentSession.currentDrinkSize = size;
	});
	$("#espresso-button").on('click', function () {

		$("#modal-overlay").show();
		$("#modal-drink-esp").show();

		// Change session selected drink size
		var size = "Espresso"
		currentSession.currentDrinkSize = size;
	});

	// Main function to dispatch on item change
	$(".subitem-button").on('click', function () {

		if ($(this).attr("value") == "drink") {
			
			// If we're adding a drink, construct the drink with size and name
			var drinkName = $(this).find(".subitem-button-title")[0].innerHTML;
			var newDrink = $.extend(true, {}, protoDrink);
			newDrink.itemSize = currentSession.currentDrinkSize;
			newDrink.itemName = drinkName;

			// And add into current session
			currentSession.addItem(newDrink);
			resetModal();

		} else if ($(this).attr("value") == "customization") {

			// If we're adding a customization, construct the customization
			var customizationName = $(this).find(".subitem-button-title")[0].innerHTML;
			var newCustomization = $.extend(true, {}, protoCustomization);
			newCustomization.itemName = customizationName;

			// Then add this customziation to the corresponding drink
			currentSession.purchasedItems[currentItemIndex].addCustomization(newCustomization);

			// Don't reset modal
			// resetModal();

		} else if ($(this).attr("value") == "item") {

			resetModal();

		} else if ($(this).attr("value") == "customPrice") {

			resetModal();

		} else if ($(this).attr("value") == "deleteItem") {

			currentSession.removeItem(currentItemIndex);
			resetModal();

		} else if ($(this).attr("value") == "deleteCustomization") {
			currentSession.purchasedItems[currentItemIndex].removeCustomization(currentCustomizationIndex);
			resetModal();
		}
	});

	// Customize drinks
	$(document).on('click', ".js-item-cell", function () {
		currentItemIndex = parseInt( $(this).attr("itemIndex") );

		if ($(this).attr("value") == "drink") {

			// Move #modal-customization-drink to the correct position, and move its background
			var originalPosition = $(this).offset();
			var newLeft = itemCellSize.width;
			var newTop = originalPosition.top >= 448 ? 448 : originalPosition.top;
			$("#modal-customization-drink").css({
				"left" : newLeft,
				"top" : newTop,
				"background" : "url(img/bg-pattern.png) 0 0 repeat, linear-gradient(rgba(247, 251, 255, 0.6), rgba(247, 251, 255, 0.6)), url(img/bg-blurred.png) -" + newLeft + "px -" + newTop + "px no-repeat"
			});

			// Change #modal-customization-drink's title
			$("#modal-customization-drink-name")[0].innerHTML = currentSession.purchasedItems[currentItemIndex].getItemDescription();

			// Show drink customization
			$("#modal-overlay").show();
			$("#modal-customization-drink").show();
		}
	});

	// Remove customization
	$(document).on('click', ".js-customization-cell", function() {
		currentItemIndex = parseInt( $(this).attr("itemIndex") );
		currentCustomizationIndex = parseInt( $(this).attr("customizationIndex") );

		// Move #modal-delete-customization to the correct position, and move its background
		var originalPosition = $(this).offset();
		var newLeft = itemCellSize.width;
		var newTop = originalPosition.top >= 864 ? 864 : originalPosition.top;
		$("#modal-delete-customization").css({
			"left" : newLeft,
			"top" : newTop,
			"background" : "url(img/bg-pattern.png) 0 0 repeat, linear-gradient(rgba(247, 251, 255, 0.6), rgba(247, 251, 255, 0.6)), url(img/bg-blurred.png) -" + newLeft + "px -" + newTop + "px no-repeat"
		});

		// Change #modal-delete-customization's title
		$("#modal-delete-customization-name")[0].innerHTML = currentSession.purchasedItems[currentItemIndex].itemCustomization[currentCustomizationIndex].getItemDescription();

		// Show drink customization
		$("#modal-overlay").show();
		$("#modal-delete-customization").show();
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

	// Attach fast click
	$(function() {
    	FastClick.attach(document.body);
	});

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