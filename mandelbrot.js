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
let xOffset = 400;
let yOffset = 300;

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
  let x = 0;
  setInterval(function() {
    if (x < canvas.width) {
      for (let y = 0; y < canvas.height; y++) {
        let belongsToSet = mandelbrotCheck(
          (x - xOffset) / magnificationFactor,
          (y - yOffset) / magnificationFactor
        );
        if (belongsToSet) {
          frac.fillRect(x, y, 1, 1);
        }
      }
    }
    x++;
  }, 0);
}

function renderSelection() {
  let selStepX = selWidth / canvas.width;
  let selStepY = selHeight / canvas.height;
  console.log(
    "x1:",
    x1,
    "y1:",
    y1,
    "x2:",
    x2,
    "y2:",
    y2,
    "selWidth:",
    selWidth,
    "selHeight:",
    selHeight
  );

  frac.clearRect(0, 0, canvas.width, canvas.height);
  selection.clearRect(0, 0, overlay.width, overlay.height);

  let x = 0;
  setInterval(function() {
    if (x < canvas.width) {
      for (let y = 0; y < canvas.height; y++) {
        let belongsToSet = mandelbrotCheck(
          (x1 + x * selStepX - 400) / magnificationFactor,
          (y1 + y * selStepY - 300) / magnificationFactor
        );
        if (belongsToSet) {
          frac.fillRect(x, y, 1, 1);
        }
      }
    }
    x++;
  }, 0);
}

render();

overlay.addEventListener("click", canvasClick);
overlay.addEventListener("mousemove", drawSelection);

let drawingBox = false;
let x1, y1, x2, y2, selWidth, selHeight;

function canvasClick(event) {
  let rect = overlay.getBoundingClientRect();
  let x = event.clientX - rect.left - 2;
  let y = event.clientY - rect.top - 2;
  console.log(x, y);
  if (drawingBox == false) {
    x1 = x;
    y1 = y;
    drawingBox = true;
  } else {
    x2 = x;
    y2 = y;
    drawingBox = false;
  }
}

function drawSelection(event) {
  if (drawingBox == true) {
    selection.clearRect(0, 0, overlay.width, overlay.height);
    let rect = overlay.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    selection.fillStyle = "rgba(0, 0, 255, 0.3)";
    selWidth = mouseX - x1;
    selHeight = mouseY - y1;

    if (selWidth < 0 || selHeight < 0) return;
    if (selWidth > selHeight) selHeight = selWidth;
    if (selHeight > selWidth) selWidth = selHeight;

    selection.fillRect(x1, y1, selWidth, selHeight);
  }
}

let renderSel = document.getElementById("renderSel");
let progress = document.getElementById("progress");

renderSel.addEventListener("click", renderSelection);
