let canvas = document.getElementById("frac");
let overlay = document.getElementById("overlay");
canvas.width = 600;
canvas.height = 600;
overlay.width = 600;
overlay.height = 600;
frac = canvas.getContext("2d");
selection = overlay.getContext("2d");

let iterations = 200;
let magnificationFactor = 250;

function mandelbrotCheck(x, y) {
  let real = x;
  let imag = y;

  for (let i = 0; i < iterations; i++) {
    tempX = real * real - imag * imag + x;
    tempY = 2 * real * imag + y;

    real = tempX;
    imag = tempY;

    if (tempX < -2 || tempX > 2 || tempY < -2 || tempY > 2) {
      return false;
    }
  }
  return true;
}

function render() {
  frac.clearRect(0, 0, canvas.width, canvas.height);
  for (x = 0; x < canvas.width; x++) {
    for (y = 0; y < canvas.height; y++) {
      let belongsToSet = mandelbrotCheck(
        (x - 400) / magnificationFactor,
        (y - 300) / magnificationFactor
      );
      if (belongsToSet) {
        frac.fillRect(x, y, 1, 1);
      }
    }
  }
}

render();

overlay.addEventListener("click", canvasClick);
overlay.addEventListener("mousemove", drawSelection);

let drawingBox = false;
let x1, y1, x2, y2 //, oldX, oldY, oldWidth, oldHeight;

function canvasClick(event) {
  let rect = overlay.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  if (drawingBox == false) {
    x1 = x;
    y1 = y;
    console.log("x1: " + x1 + ", y1: " + y1);
    drawingBox = true;
  } else {
    x2 = x;
    y2 = y;
    console.log("x2: " + x2 + ", y2: " + y2);
    drawingBox = false;
  }
}

function drawSelection(event) {
  if (drawingBox == true) {
      selection.clearRect(0, 0, overlay.width, overlay.height);
      let rect = overlay.getBoundingClientRect();
      let a = event.clientX - rect.left;
      let b = event.clientY - rect.top;
      selection.fillStyle = "rgba(0, 0, 255, 0.3)";
      let w = a - x1;
      let h = b - y1;

    // constrain to square!!

      selection.fillRect(x1, y1, w, h);
    }
  }

