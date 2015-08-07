// Cached mouse position for animation
var targetMouseX = 0, targetMouseY = 0;
var mouseX = 0, mouseY = 0;

// Resize canvas
function resizeLandingContent() {
  var h = $('#hero-canvas').width() / 2.5;
  $('#hero-canvas').css("height", h + "px");
}

// Mouse movement calculation
function ditherMousePos(current, maxDither, minDither) {
  return current + Math.random() * (maxDither - minDither) + minDither;
}

function ditherMouseTarget(target, minTarget, maxTarget) {
  var ditheredPos = ditherMousePos(target, -50, 50)

  if (ditheredPos < minTarget) {
    return minTarget;
  } else if (ditheredPos > maxTarget) {
    return maxTarget;
  }

  return ditheredPos;
}

function calculateMousePos(current, target) {
  return current + (target - current) / 30;
}

// Redraw canvas contents
function draw(mouseX, mouseY) {
  var canvas = $("#landing-canvas")[0];
  var ctx = canvas.getContext("2d");
  var i, j;

  // Resize canvas so that it's as large as the landing area
  canvas.width = $("#hero-canvas").width();
  canvas.height = $("#hero-canvas").height();
  var diagonalDist = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));

  // Size of box
  var boxNumVertical = Math.floor(canvas.height / 64);
  var boxSize = Math.ceil(canvas.height / boxNumVertical);
  var boxNumHorizontal = Math.ceil(canvas.width / boxSize);
  var boxXOffset = Math.ceil((boxNumHorizontal * boxSize - canvas.width) / 2);

  // Color setting
  var centerColor = [81, 127, 164];   // #517fa4
  var edgeColor = [36, 57, 73];       // #243949

  // Actual drawing
  for (i = 0; i < boxNumHorizontal; ++i) {
    for (j = 0; j < boxNumVertical; ++j) {

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

// Animation
function animateMouseMove() {
  mouseX = calculateMousePos(mouseX, targetMouseX);
  mouseY = calculateMousePos(mouseY, targetMouseY);
  draw(mouseX, mouseY);

  // Dither target; make sure the target is within canvas
  var canvasWidth = $("#hero-canvas").width();
  var canvasHeight = $("#hero-canvas").height();
  targetMouseX = ditherMouseTarget(targetMouseX, canvasWidth * 0.1, canvasWidth * 0.9);
  targetMouseY = ditherMouseTarget(targetMouseY, canvasHeight * 0.1, canvasHeight * 0.9);

  setTimeout(animateMouseMove, 20);
}

// Document ready!
$(document).ready(function() {

  $(window).resize(function() {
    // Resize landing area on window resize
    resizeLandingContent();
  });

  $("#hero-canvas").mousemove(function (e) {
    // On mouse move over landing area, reset mouse target
    targetMouseX = e.pageX;
    targetMouseY = e.pageY;
  });

  // Set up laning element resize
  resizeLandingContent();

  // Initial drawing
  targetMouseX = $("#landing").width() / 2;
  targetMouseY = $("#landing").height() / 2;

  // Kick off animation
  animateMouseMove();
});
