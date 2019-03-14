let canvas = document.getElementById("frac");
canvas.width = 680;
canvas.height = 680;

frac = canvas.getContext("2d");

function checkIfBelongsToMandelbrotSet(x, y) {
  var realComponentOfResult = x;
  var imaginaryComponentOfResult = y;

  for (var i = 0; i < 100; i++) {
    // Calculate the real and imaginary components of the result
    // separately
    var tempRealComponent =
      realComponentOfResult * realComponentOfResult -
      imaginaryComponentOfResult * imaginaryComponentOfResult +
      x;

    var tempImaginaryComponent =
      2 * realComponentOfResult * imaginaryComponentOfResult + y;

    realComponentOfResult = tempRealComponent;
    imaginaryComponentOfResult = tempImaginaryComponent;
  }

  if (realComponentOfResult * imaginaryComponentOfResult < 5) return true; // In the Mandelbrot set

  return false; // Not in the set
}

var magnificationFactor = 200;
var panX = 2;
var panY = 1.5;
for (x = 0; x < 680; x++) {
  for (y = 0; y < 680; y++) {
    var belongsToSet = checkIfBelongsToMandelbrotSet(
      x / magnificationFactor - panX,
      y / magnificationFactor - panY
    );
    if (belongsToSet) {
      frac.fillRect(x, y, 1, 1); // Draw a black pixel
    }
  }
}
