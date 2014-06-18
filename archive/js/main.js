// resize landing div so that it's always the size of the window
function resizeLandingContent() {
	var e = $(window).height() * 2 / 3;
	$('#landing').css("height", e + "px")
}

$(document).ready(function() {
	resizeLandingContent();

	// bind the function to window resizing function
	$(window).resize(function() {
		resizeLandingContent();
	})
});
