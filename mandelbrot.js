let canvas = document.getElementById("frac");
let overlay = document.getElementById("overlay");
canvas.width = 600;
canvas.height = 600;
overlay.width = 600;
overlay.height = 600;
frac = canvas.getContext("2d");
selection = overlay.getContext("2d");

let iterations = 300;
let selWidth = canvas.width;
let selHeight = canvas.height;
let x1 = 0;
let y1 = 0;
let count = 0;

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
      return false;
    }
  }
  return true;
}

function updateRenderList() {
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
  renderSelection();
}

function renderSelection() {
  console.log(renderList[count]);
  frac.clearRect(0, 0, canvas.width, canvas.height);
  selection.clearRect(0, 0, overlay.width, overlay.height);

  let x = 0;
  setInterval(function() {
    if (x < canvas.width) {
      for (let y = 0; y < canvas.height; y++) {
        let belongsToSet = mandelbrotCheck(
          renderList[count].selectionX +
            x * (renderList[count].selectionWidth / canvas.width),
          renderList[count].selectionY +
            y * (renderList[count].selectionHeight / canvas.height)
        );
        if (belongsToSet) {
          frac.fillRect(x, y, 1, 1);
        }
      }
    }
    x++;
  }, 0);
}

function goBack() {
  count = count - 1;
  renderList.pop();
  renderSelection();
}

renderSelection();

overlay.addEventListener("click", canvasClick);
overlay.addEventListener("mousemove", drawSelection);

let drawingBox = false;
let x2, y2;

function canvasClick(event) {
  let rect = overlay.getBoundingClientRect();
  let x = event.clientX - rect.left - 2;
  let y = event.clientY - rect.top - 2;
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
let backBtn = document.getElementById("back");

renderSel.addEventListener("click", updateRenderList);
backBtn.addEventListener("click", goBack);
