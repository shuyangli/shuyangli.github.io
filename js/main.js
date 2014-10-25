// Cached mouse position for redrawing canvas on resize
var cachedMouseX = 0, cachedMouseY = 0;

// Resize landing div so that it's always the size of the window
function resizeLandingContent() {
	var e = $(window).height();
	$('#landing').css("height", e + "px");
}

// Redraw canvas contents
function draw(mouseX, mouseY) {
	var canvas = $("#landing-canvas")[0];
	var ctx = canvas.getContext("2d");

	// Resize canvas so that it's as large as the landing area
	canvas.width = $("#landing").width();
	canvas.height = $("#landing").height();
	var diagonalDist = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));

	// Size of box
	var boxNumVertical = Math.floor(canvas.height / 64);
	var boxSize = Math.ceil(canvas.height / boxNumVertical);
	var boxNumHorizontal = Math.ceil(canvas.width / boxSize);
	var boxXOffset = Math.ceil((boxNumHorizontal * boxSize - canvas.width) / 2);

	// Color setting
	// var centerColor = [0x51, 0x7f, 0xa4]; 	// 81, 127, 164
	var centerColor = [81, 127, 164];
	// var edgeColor = [0x24, 0x39, 0x49];		// 36, 57, 73
	var edgeColor = [36, 57, 73];

	// Actual drawing
	for (var i = 0; i < boxNumHorizontal; ++i) {
		for (var j = 0; j < boxNumVertical; ++j) {

			// Set color
			var boxCenterX = i * boxSize - boxXOffset + boxSize / 2;
			var boxCenterY = j * boxSize + boxSize / 2;
			var dist = Math.sqrt(Math.pow(boxCenterX - mouseX, 2) + Math.pow(boxCenterY - mouseY, 2));

			var currentColor = [
				Math.ceil(centerColor[0] - (centerColor[0] - edgeColor[0]) * dist / diagonalDist),
				Math.ceil(centerColor[1] - (centerColor[1] - edgeColor[1]) * dist / diagonalDist),
				Math.ceil(centerColor[2] - (centerColor[2] - edgeColor[2]) * dist / diagonalDist)
			];

			var currentColorString = "rgb(" + currentColor[0] + "," + currentColor[1] + "," + currentColor[2] + ")";

			// Draw box
			ctx.fillStyle = currentColorString;
			ctx.strokeStyle = currentColorString;
			ctx.fillRect(i * boxSize - boxXOffset, j * boxSize, boxSize, boxSize);
		}
	}
}

// Scroll to form
function scrollToSayHiForm () {

	// Scroll
	$('html, body').animate({
		scrollTop: $("#talk-to-me").offset().top
	}, 1000, "swing");

	// Color change
	$("#talk-to-me").delay(100).animate({
		color:"#008DFF"
	}, 800).delay(200).animate({
		color:"#000000"
	}, 800);
}

// Document ready!
$(document).ready(function() {

	$(window).resize(function() {
		// On window resize, resize landing contents, and then redraw canvas contents
		resizeLandingContent();
		draw(cachedMouseX, cachedMouseY);
	});

	$("#landing").mousemove(function (e) {
		// On mouse move over landing area, redraw canvas contents
		cachedMouseX = e.pageX;
		cachedMouseY = e.pageY;
		draw(cachedMouseX, cachedMouseY);
	});

	// Set up laning element resize
	resizeLandingContent();

	// Initial drawing
	cachedMouseX = $("#landing").width() / 2;
	cachedMouseY = $("#landing").height() / 2;
	draw(cachedMouseX, cachedMouseY);
});
