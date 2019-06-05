let size = 600;

let canvas = document.getElementById("frac");
let overlay = document.getElementById("overlay");
canvas.width = size;
canvas.height = size;
overlay.width = size;
overlay.height = size;
frac = canvas.getContext("2d");
selection = overlay.getContext("2d");

let iterations = 600;
let selWidth = canvas.width;
let selHeight = canvas.height;
let x1 = 0;
let y1 = 0;
let count = 0;
let renderUpdate = false;

let renderList = [
  {
    selectionWidth: 2.4,
    selectionHeight: 2.4,
    selectionX: -1.6,
    selectionY: -1.2
  }
];

function mandelbrotCheck(x, y) {
  let real = x;
  let imag = y;

  for (let i = 0; i < iterations; i++) {
    tempX = real * real - imag * imag + x;
    tempY = 2 * real * imag + y;

    real = tempX;
    imag = tempY;

    if (tempX < -2 || tempX > 2 || tempY < -2 || tempY > 2) {
      return i;
    }
  }
  return iterations;
}

function updateRenderList() {
<<<<<<< HEAD
  let newRender = {
    selectionWidth:
      selWidth * (renderList[count].selectionWidth / canvas.width),
    selectionHeight:
      selHeight * (renderList[count].selectionHeight / canvas.height),
    selectionX:
      renderList[count].selectionX +
      x1 * (renderList[count].selectionWidth / canvas.width),
    selectionY:
      renderList[count].selectionY +
      y1 * (renderList[count].selectionHeight / canvas.height)
  };
  renderList.push(newRender);
  count++;
=======
  if (renderUpdate) {
    let newRender = {
      selectionWidth: selWidth * (renderList[count].selectionWidth / size),
      selectionHeight: selHeight * (renderList[count].selectionHeight / size),
      selectionX:
        renderList[count].selectionX +
        x1 * (renderList[count].selectionWidth / size),
      selectionY:
        renderList[count].selectionY +
        y1 * (renderList[count].selectionHeight / size)
    };
    renderList.push(newRender);
    count++;
    backBtn.disabled = false;
  }
  renderUpdate = false;
>>>>>>> 21f7b150587ed5aca05a65ea98534170f39b0c73
  renderSelection();
}

function renderSelection() {
  console.log(renderList[count]);
  frac.clearRect(0, 0, canvas.width, canvas.height);
  selection.clearRect(0, 0, overlay.width, overlay.height);

  let x = 0;
  setInterval(function() {
<<<<<<< HEAD
    if (x < canvas.width) {
      for (let y = 0; y < canvas.height; y++) {
        let belongsToSet = mandelbrotCheck(
          renderList[count].selectionX +
            x * (renderList[count].selectionWidth / canvas.width),
          renderList[count].selectionY +
            y * (renderList[count].selectionHeight / canvas.height)
=======
    if (x < size) {
      for (let y = 0; y < size; y++) {
        let belongsToSet = mandelbrotCheck(
          renderList[count].selectionX +
            x * (renderList[count].selectionWidth / size),
          renderList[count].selectionY +
            y * (renderList[count].selectionHeight / size)
>>>>>>> 21f7b150587ed5aca05a65ea98534170f39b0c73
        );
        if (belongsToSet == iterations) {
          frac.fillStyle = "#000";
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * fringeSlider.value) {
          frac.fillStyle = "#a647e5";
          frac.fillRect(x, y, 1, 1);
        }
      }
    }
    x++;
  }, 0);
}

function goBack() {
  count = count - 1;
  if (count == 0) backBtn.disabled = true;
  renderList.pop();
  renderSelection();
}

renderSelection();

overlay.addEventListener("click", canvasClick);
overlay.addEventListener("mousemove", drawSelection);

let drawingBox = false;

function canvasClick(event) {
  let rect = overlay.getBoundingClientRect();
  let x = event.clientX - rect.left - 2;
  let y = event.clientY - rect.top - 2;
  if (drawingBox == false) {
    x1 = x;
    y1 = y;
    drawingBox = true;
  } else {
    drawingBox = false;
    renderUpdate = true;
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

function iterUpdate() {
  iterDisplay.textContent = `Iterations: ${iterSlider.value}`;
  iterations = iterSlider.value;
}

function fringeUpdate() {
  fringeDisplay.textContent = `Fringe: ${fringeSlider.value}%`;
}

let renderSel = document.getElementById("renderSel");
let backBtn = document.getElementById("back");
let iterDisplay = document.getElementById("iterDisplay");
let iterSlider = document.getElementById("iterSlider");
let fringeSlider = document.getElementById("fringeSlider");
let fringeDisplay = document.getElementById("fringeDisplay");

backBtn.disabled = true;

renderSel.addEventListener("click", updateRenderList);
backBtn.addEventListener("click", goBack);
iterSlider.addEventListener("change", iterUpdate);
fringeSlider.addEventListener("change", fringeUpdate);
