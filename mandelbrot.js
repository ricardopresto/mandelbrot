const canvas = document.getElementById("frac"),
  overlay = document.getElementById("overlay"),
  frac = canvas.getContext("2d"),
  selection = overlay.getContext("2d");

const renderBtn = document.getElementById("renderBtn"),
  backBtn = document.getElementById("backBtn"),
  resetBtn = document.getElementById("resetBtn"),
  iterDisplay = document.getElementById("iterDisplay"),
  iterSlider = document.getElementById("iterSlider"),
  fringeColor1 = document.getElementById("fringeColor00"),
  fringeColor2 = document.getElementById("fringeColor01"),
  fringeColor3 = document.getElementById("fringeColor02"),
  fringeColor4 = document.getElementById("fringeColor03"),
  fringeColor5 = document.getElementById("fringeColor04"),
  canvasContainer = document.getElementById("canvasContainer"),
  controls = document.getElementById("controls");

renderBtn.addEventListener("click", renderBtnClick);
backBtn.addEventListener("click", goBack);
resetBtn.addEventListener("click", reset);
iterSlider.addEventListener("mousemove", iterUpdate);
iterSlider.addEventListener("touchmove", iterUpdate);
iterSlider.addEventListener("change", iterUpdate);
backBtn.disabled = true;

overlay.addEventListener("click", canvasClick);
overlay.addEventListener("mousemove", mouseMove);
overlay.addEventListener("mousedown", mouseDown);
overlay.addEventListener("mouseup", mouseUp);
overlay.addEventListener("touchmove", touchMove);
overlay.addEventListener("touchstart", touchStart);
overlay.addEventListener("touchend", touchEnd);

let landscape;

window.innerWidth > window.innerHeight ? setLandscape() : setPortrait();

window.onresize = () => {
  window.innerWidth < window.innerHeight + 230 ? setPortrait() : setLandscape();
};

function setPortrait() {
  landscape = false;
  size = window.innerWidth * 0.9;
  canvas.width = canvas.height = overlay.width = overlay.height = size;
  canvasContainer.style.height = canvasContainer.style.width = `${size}px`;
  canvasContainer.style.marginTop = "50px";
  controls.style.flexDirection = "row";
  controls.style.width = canvasContainer.style.width;
  buttons.style.width = "40%";
}

function setLandscape() {
  landscape = true;
  size = window.innerHeight * 0.9;
  canvas.width = canvas.height = overlay.width = overlay.height = size;
  canvasContainer.style.height = canvasContainer.style.width = `${size}px`;
  canvasContainer.style.marginTop = "20px";
  controls.style.flexDirection = "column";
  controls.style.height = canvasContainer.style.height;
  controls.style.width = sliders.style.width;
  buttons.style.width = controls.style.width;
}

let iterations = 500;
let selWidth = canvas.width;
let selHeight = canvas.height;
let x1 = 0;
let y1 = 0;
let count = 0;
let boxPositionX, boxPositionY;
let squareSizeX, squareSizeY;
let rendering = false;
let renderUpdate = false;
let drawingBox = false;
let dragging = false;
let finishDrag = false;
let loop;

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

function renderBtnClick() {
  rendering ? stop() : updateRenderList();
}

function updateRenderList() {
  if (renderUpdate) {
    if (squareSizeY < 0) {
      squareSizeY = Math.abs(squareSizeY);
      y1 = y1 - squareSizeY;
    }
    if (squareSizeX < 0) {
      squareSizeX = Math.abs(squareSizeX);
      x1 = x1 - squareSizeX;
    }

    selection.fillStyle = "rgba(255, 0, 0, 1)";
    selection.fillRect(x1, y1, squareSizeX, squareSizeY);

    let newRender = {
      selectionWidth: squareSizeX * (renderList[count].selectionWidth / size),
      selectionHeight: squareSizeY * (renderList[count].selectionHeight / size),
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
  console.log(renderList);
  render();
}

function render() {
  let x = 0;
  frac.clearRect(0, 0, canvas.width, canvas.height);
  selection.clearRect(0, 0, overlay.width, overlay.height);
  renderBtn.innerText = "Stop";
  resetBtn.disabled = true;
  backBtn.disabled = true;
  rendering = true;

  loop = setInterval(function() {
    if (x < size) {
      for (let y = 0; y < size; y++) {
        let belongsToSet = mandelbrotCheck(
          renderList[count].selectionX +
            x * (renderList[count].selectionWidth / size),
          renderList[count].selectionY +
            y * (renderList[count].selectionHeight / size)
        );
        if (belongsToSet == iterations) {
          frac.fillStyle = "#000";
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * percentPositions[4]) {
          frac.fillStyle = `#${fringeColor5.value}`;
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * percentPositions[3]) {
          frac.fillStyle = `#${fringeColor4.value}`;
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * percentPositions[2]) {
          frac.fillStyle = `#${fringeColor3.value}`;
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * percentPositions[1]) {
          frac.fillStyle = `#${fringeColor2.value}`;
          frac.fillRect(x, y, 1, 1);
        } else if (belongsToSet > (iterations / 100) * percentPositions[0]) {
          frac.fillStyle = `#${fringeColor1.value}`;
          frac.fillRect(x, y, 1, 1);
        }
      }
    }
    x++;
    if (x > size) {
      resetBtn.disabled = false;
      count > 0 ? (backBtn.disabled = false) : null;
      renderBtn.innerText = "Render";
      clearInterval(loop);
    }
  }, 0);
}

function stop() {
  clearInterval(loop);
  rendering = false;
  resetBtn.disabled = false;
  count > 0 ? (backBtn.disabled = false) : null;
  renderBtn.innerText = "Render";
}

function goBack() {
  count = count - 1;
  if (count == 0) backBtn.disabled = true;
  renderList.pop();
  render();
}

function reset() {
  renderList = [
    {
      selectionWidth: 2.4,
      selectionHeight: 2.4,
      selectionX: -1.6,
      selectionY: -1.2
    }
  ];
  selWidth = canvas.width;
  selHeight = canvas.height;
  x1 = 0;
  y1 = 0;
  count = 0;
  backBtn.disabled = true;
  render();
}

function canvasClick(e) {
  let rect = overlay.getBoundingClientRect();
  let x = e.clientX - rect.left - 2;
  let y = e.clientY - rect.top - 2;
  if (finishDrag == true) {
    finishDrag = false;
    return;
  }
  if (drawingBox == false) {
    x1 = x;
    y1 = y;
    drawingBox = true;
  } else {
    drawingBox = false;
    renderUpdate = true;
  }
}

function mouseMove(e) {
  if (drawingBox == true) {
    drawSelection(e);
  } else if (dragging == true) {
    dragBox(e);
  }
}

function touchMove(e) {
  if (dragging == true) {
    touchDrag(e);
  }
}

function mouseDown(e) {
  let rect = overlay.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  if (selection.getImageData(mouseX, mouseY, 1, 1).data[3] == 92) {
    dragging = true;
    boxPositionX = mouseX - x1;
    boxPositionY = mouseY - y1;
  }
}

function touchStart(e) {
  if (e.targetTouches.length == 1) {
    let touch = e.targetTouches[0];
    let rect = overlay.getBoundingClientRect();
    let touchX = touch.pageX - rect.left;
    let touchY = touch.pageY - rect.top;
    if (selection.getImageData(touchX, touchY, 1, 1).data[3] == 92) {
      dragging = true;
      boxPositionX = touchX - x1;
      boxPositionY = touchY - y1;
    }
  }
}

function mouseUp() {
  if (dragging == true) {
    finishDrag = true;
    dragging = false;
  }
}

function touchEnd() {
  if (dragging == true) {
    dragging = false;
  }
}

function dragBox(e) {
  selection.clearRect(0, 0, overlay.width, overlay.height);

  let rect = overlay.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  x1 = mouseX - boxPositionX;
  y1 = mouseY - boxPositionY;
  selection.fillStyle = "rgba(0, 0, 255, 0.36)";
  selection.fillRect(x1, y1, squareSizeX, squareSizeY);
}

function touchDrag(e) {
  e.preventDefault();
  if (e.targetTouches.length == 1) {
    selection.clearRect(0, 0, overlay.width, overlay.height);
    let touch = e.targetTouches[0];
    let rect = overlay.getBoundingClientRect();
    let touchX = touch.pageX - rect.left;
    let touchY = touch.pageY - rect.top;
    x1 = touchX - boxPositionX;
    y1 = touchY - boxPositionY;
    selection.fillStyle = "rgba(0, 0, 255, 0.36)";
    selection.fillRect(x1, y1, squareSizeX, squareSizeY);
  }
}

function drawSelection(e) {
  if (drawingBox == true) {
    selection.clearRect(0, 0, overlay.width, overlay.height);
    let rect = overlay.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    selWidth = mouseX - x1;
    selHeight = mouseY - y1;

    selection.fillStyle = "rgba(0, 0, 255, 0.2)";
    selection.fillRect(x1, y1, selWidth, selHeight);
    selection.fillStyle = "rgba(0, 0, 255, 0.2)";
    if (selWidth > 0 && selHeight > 0) {
      squareSizeX = squareSizeY = Math.min(selWidth, selHeight);
    }
    if (selWidth < 0 && selHeight < 0) {
      squareSizeX = squareSizeY = Math.max(selWidth, selHeight);
    }
    if (selWidth > 0 && selHeight < 0) {
      squareSizeX = Math.min(selWidth, Math.abs(selHeight));
      squareSizeY = -squareSizeX;
    }
    if (selWidth < 0 && selHeight > 0) {
      squareSizeY = Math.min(selHeight, Math.abs(selWidth));
      squareSizeX = -squareSizeY;
    }
    selection.fillRect(x1, y1, squareSizeX, squareSizeY);
  }
}

function iterUpdate() {
  iterations = iterSlider.value;
  iterDisplay.textContent = iterSlider.value;
}

render();

const dragBoxes = Array.from(document.getElementsByClassName("dragBox"));
const sliderBoxes = Array.from(document.getElementsByClassName("sliderBox"));
const container2 = document.getElementById("container2");

var dragStarts = [];
var dragPositions = [437, 469, 501, 533, 565];
var percentPositions = [100, 100, 100, 100, 100];

for (n = 0; n < dragPositions.length; n++) {
  dragBoxes[n].dragging = false;
  sliderBoxes[n].style.top = dragPositions[n] + "px";

  dragBoxes[n].addEventListener("mousedown", e => {
    dragBoxes[e.target.id].dragging = true;
    dragStarts[e.target.id] = e.offsetY;
  });
}

document.addEventListener("mousemove", e => {
  for (let n = 0; n < dragBoxes.length; n++) {
    if (dragBoxes[n].dragging == true) {
      let pos = e.clientY - dragStarts[n] - 51;
      if (pos > n * 32 + 2 && pos < 596 - (5 - n) * 32 + 2) {
        dragPositions[n] = pos;
        sliderBoxes[n].style.top = `${dragPositions[n]}px`;
      }
      calculatePosition(n, sliderBoxes[n].style.top);
    }
    moveNextBox(n);
  }
  for (let n = dragBoxes.length - 1; n >= 0; n--) {
    movePrevBox(n);
  }
});

document.addEventListener("mouseup", () => {
  for (n = 0; n < dragPositions.length; n++) {
    dragBoxes[n].dragging = false;
  }
});

function moveNextBox(n) {
  if (dragPositions[n] > dragPositions[n + 1] - 32) {
    dragPositions[n + 1] = dragPositions[n] + 32;
    sliderBoxes[n + 1].style.top = `${dragPositions[n + 1]}px`;
  }
}
function movePrevBox(n) {
  if (dragPositions[n] < dragPositions[n - 1] + 32) {
    dragPositions[n - 1] = dragPositions[n] - 32;
    sliderBoxes[n - 1].style.top = `${dragPositions[n - 1]}px`;
  }
}

function calculatePosition(n, top) {
  top = Number(top.slice(0, -2));
  let range = 600 - (5 - n) * 32 - n * 32;
  let position = top - n * 32 - 3;
  let positionPercent = (100 / range) * position;
  percentPositions[n] = Math.floor(positionPercent) + 2;
  console.log(percentPositions);
}
