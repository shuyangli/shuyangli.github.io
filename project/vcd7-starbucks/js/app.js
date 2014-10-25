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
});