let canvas = document.getElementById("frac");
canvas.width = 600;
canvas.height = 600;
frac = canvas.getContext("2d");

let iterations = 200;
var magnificationFactor = 280;
let panX = 1.45;
let panY = 2;

function checkIfBelongsToMandelbrotSet(x, y) {
  var realComponentOfResult = x;
  var imaginaryComponentOfResult = y;

  for (var i = 0; i < iterations; i++) {
    var tempRealComponent =
      realComponentOfResult * realComponentOfResult -
      imaginaryComponentOfResult * imaginaryComponentOfResult +
      x;

    var tempImaginaryComponent =
      2 * realComponentOfResult * imaginaryComponentOfResult + y;

    realComponentOfResult = tempRealComponent;
    imaginaryComponentOfResult = tempImaginaryComponent;
  }

  if (realComponentOfResult * imaginaryComponentOfResult < 5) return true;

  return false;
}

function render() {
  frac.clearRect(0, 0, canvas.width, canvas.height);
  for (x = 0; x < canvas.width; x++) {
    for (y = 0; y < canvas.height; y++) {
      var belongsToSet = checkIfBelongsToMandelbrotSet(
        (x - canvas.width / panX) / magnificationFactor,
        (y - canvas.height / panY) / magnificationFactor
      );
      if (belongsToSet) {
        frac.fillRect(x, y, 1, 1);
      }
    }
  }
}

render();
