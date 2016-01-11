$(document).ready(function () {
  // Deobfuscate email and write to proper email link
  var obfuscated_email = "vkx|dqj1ol1<8Cjpdlo1frp";

  $("#_email_link").prop("href", "mailto:" + window._deobfuscate_email(obfuscated_email));

  // Toggle footer
  $("#_quote_block_toggle").on("click", function() {
    $("#_quote_block").fadeToggle(400);
  });
  $("#_quote_block").hide();

  // Setup page-specific calls
  if (typeof window._page_setup !== 'undefined') {
    window._page_setup();
  }
});
