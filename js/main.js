// Resize landing div so that it's always the size of the window
function resizeLandingContent() {
	var e = $(window).height();
	$('#landing').css("height", e + "px")
}

// Introduce recommendation form at "let me know" click
function introduceRecForm() {
	if (!$("#recFormContainer").has("#recForm").length) {
		var formHTMLString = "<form id=\"recForm\" class=\"sl-form col-sm-offset-1\">\
			<label>your name: <input type=\"text\" name=\"friendName\" id=\"friendName\" /></label><br />\
			<label>link or title of your recommendation: <input type=\"text\" name=\"recDetail\" id=\"recDetail\" /></label><br />\
			<label>how can i contact you: <input type=\"text\" name=\"friendContact\" id=\"friendContact\" /></label><br />\
			<a id=\"submitRecFormButton\" role=\"button\" onClick=\"submitRecForm()\">submit</span>\
		</form>";
		$(formHTMLString).hide().appendTo("#recFormContainer").fadeIn(300);
	} else {
		$("#recForm").fadeOut(300, function(){$(this).remove()});
	}
}

// Submit recommendation form to Parse
function submitRecForm() {

	// Send
	if ($('#recDetail').val().length > 0) {

		var Recommendation = Parse.Object.extend("Recommendation");
		var newRec = new Recommendation();

		newRec.save({
						friendName: $('#friendName').val(), 
						recDetail: $('#recDetail').val(),
						friendContact: $('#friendContact').val()
					})
		.then(function(newRec) {
			// Remove onClick on #submitRecFormButton
			$("#submitRecFormButton").attr('onclick', '');

			// Display a "thanks" label
			$("<span>thank you</span>").hide().appendTo('#recForm').fadeIn(300);
			$("#recForm").delay(1500).fadeOut(300, function() {$(this).remove()});
		});
	} else {
		// recommendation field is empty
	}
}

$(document).ready(function() {

	// Set up laning element resize
	resizeLandingContent();

	// Bind the resize function to window resizing function
	$(window).resize(function() {
		resizeLandingContent();
	})


	// Resize the text input
	// $(".sl-form").find("label").find("input").keydown(function() {
	// 	var len = $(this).val().length;
	// 	if (len > 3) {
	// 		// increase width
	// 		$(this).width(len * 11);
	// 	} else {
	// 		// restore minimal width;
	// 		$(this).width(50);
	// 	}
	// });
});
