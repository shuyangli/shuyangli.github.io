$(document).ready(function() {

	var textEditor = document.getElementById("codeForm");
	var debugTextArea = document.getElementById("debugTextArea");
	var myCodeMirror = CodeMirror.fromTextArea(textEditor, {
		lineNumbers: true
	});
	var debugEditor = CodeMirror.fromTextArea(debugTextArea, {
		lineNumbers: true
	});

	var currentMessage = "";

	var allMessages = Object();

	var messageRef = new Firebase("https://encryptedchat.firebaseIO.com");

	$('#messageInput').keypress(function (e) {
		if (e.keyCode === 13 && $('#nameInput').val() !== "") {
			try {
				var name = $('#nameInput').val();
				var message = $('#messageInput').val();
				var encrStr;
				var forLoop = "var encrypted = ''; encrypted = encrypt(message);";
				var setText = "console.log(encrypted); encrStr=encrypted;"
				var jsCode = myCodeMirror.getValue();
				console.log(eval(jsCode + forLoop + setText));
				messageRef.push({
					name: name,
					text: message,
					cipherText: encrStr,
				});
				$('#messageInput').val('');

				$("#messageList").animate({ scrollTop: $('#messageList')[0].scrollHeight}, 400);
			}
			catch(err) {
				alert("Unable to encrypt your message!: " + err);
			}
		}
	});

	$('#debugInput').keypress(function (e) {
		if (e.keyCode === 13) {
			try {
				var message = $('#debugInput').val();
				var clearText;
				var forLoop = "var decrypted = ''; decrypted = decrypt(message);";
				var setText = "clearText=decrypted;"
				var jsCode = debugEditor.getValue();
				//alert("The decrypted text is: " + eval(jsCode + forLoop + setText));
				eval(jsCode + forLoop + setText);
				//alert(clearText);
				//clearText.appendTo($('clearText'));
				$('#clearText').text('The deciphered text is: ' + clearText);

			}
			catch(err) {
				alert("Unable to decrypt your message!: " + err);
			}

			e.preventDefault();
		}
	});

	function onDecrypt() {
		try {
				var message = $('#debugInput').val();
				var clearText;
				var forLoop = "var decrypted = ''; decrypted = decrypt(message);";
				var setText = "clearText=decrypted;"
				var jsCode = debugEditor.getValue();
				//alert("The decrypted text is: " + eval(jsCode + forLoop + setText));
				eval(jsCode + forLoop + setText);
				//alert(clearText);
				//clearText.appendTo($('clearText'));
				$('#clearText').text('The deciphered text is: ' + clearText);

			}
			catch(err) {
				alert("Unable to decrypt your message!: " + err);
			}

			e.preventDefault();
	}

	$('#runButton').click(function (e) {
		try {
				var message = $('#debugInput').val();
				var clearText;
				var forLoop = "var decrypted = ''; decrypted = decrypt(message);";
				var setText = "clearText=decrypted;"
				var jsCode = debugEditor.getValue();
				//alert("The decrypted text is: " + eval(jsCode + forLoop + setText));
				eval(jsCode + forLoop + setText);
				//alert(clearText);
				//clearText.appendTo($('clearText'));
				$('#clearText').text('The deciphered text is: ' + clearText);

			}
			catch(err) {
				alert("Unable to decrypt your message!: " + err);
			}

			e.preventDefault();
	});

	var messageQuery = messageRef.limit(30);
	messageQuery.on('child_added', function (snapshot) {
		var message = snapshot.val();
		$('<p class="indMessage" onclick="setMessageFocus(this)" />').text(message.cipherText).prepend($('<strong/>').text(" > " + message.name + ": ")).attr("id", snapshot.name()).appendTo($('#messageList'));
		$("#messageList").animate({ scrollTop: $('#messageList')[0].scrollHeight}, 400);
		allMessages[snapshot.name()] = message;
	});

//Resize the text inputs!
var oneLetterWidth = 11;
 // I'm also assuming that input will resize when at least live characters
 // are typed
 var minCharacters = 3;

 $('#nameInput').keyup(function () {
     var len = $(this).val().length;
     if (len > minCharacters) {
         // increase width
         $(this).width(len * oneLetterWidth);
     } else {
         // restore minimal width;
         $(this).width(50);
     }
 });

});
