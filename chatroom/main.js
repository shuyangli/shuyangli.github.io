$(document).ready(function() {

	var textEditor = document.getElementById("codeForm");
	var myCodeMirror = CodeMirror.fromTextArea(textEditor, {
		lineNumbers: true
	});

	var messageRef = new Firebase("https://encryptedchat.firebaseIO.com");

	$('#messageInput').keypress(function (e) {
		if (e.keyCode === 13 && $('#nameInput').val() !== "") {
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
	});

	var messageQuery = messageRef.limit(10);
	messageQuery.on('child_added', function (snapshot) {
		var message = snapshot.val();
		$('<p/>').text(message.cipherText).prepend($('<strong/>').text(message.name + ": ")).appendTo($('#messageList'));
		$("#messageList").animate({ scrollTop: $('#messageList')[0].scrollHeight}, 400);
	});

});
