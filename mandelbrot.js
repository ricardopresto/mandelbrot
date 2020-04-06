"use strict";

const canvas = document.getElementById("frac"),
  overlay = document.getElementById("overlay"),
  frac = canvas.getContext("2d"),
  selection = overlay.getContext("2d");

const dragBoxes = Array.from(document.getElementsByClassName("dragBox"));
const sliderBoxes = Array.from(document.getElementsByClassName("sliderBox"));

const renderBtn = document.getElementById("renderBtn"),
  backBtn = document.getElementById("backBtn"),
  resetBtn = document.getElementById("resetBtn"),
  resetAllBtn = document.getElementById("resetAllBtn"),
  iterDisplay = document.getElementById("iterDisplay"),
  iterSlider = document.getElementById("iterSlider"),
  fringeColor1 = document.getElementById("fringeColor00"),
  fringeColor2 = document.getElementById("fringeColor01"),
  fringeColor3 = document.getElementById("fringeColor02"),
  fringeColor4 = document.getElementById("fringeColor03"),
  fringeColor5 = document.getElementById("fringeColor04"),
  canvasContainer = document.getElementById("canvasContainer"),
  container = document.getElementById("container"),
  mainControls = document.getElementById("mainControls"),
  buttons = document.getElementById("buttons"),
  fringeSliders = document.getElementById("fringeSliders"),
  fringeSliderSurround = document.getElementById("fringeSliderSurround"),
  iterationSlider = document.getElementById("iterationSlider"),
  backgroundColor = document.getElementById("backgroundColor"),
  setColor = document.getElementById("setColor");

renderBtn.addEventListener("click", renderBtnClick);
backBtn.addEventListener("click", goBack);
resetBtn.addEventListener("click", reset);
resetAllBtn.addEventListener("click", resetAll);
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

var iterations = 500;
var selWidth = canvas.width;
var selHeight = canvas.height;
var x1 = 0;
var y1 = 0;
var count = 0;
var boxPositionX, boxPositionY;
var squareSizeX, squareSizeY;
var rendering = false;
var renderUpdate = false;
var drawingBox = false;
var dragging = false;
var finishDrag = false;
var size, loop;

const sliderBoxHeight = sliderBoxes[0].offsetHeight + 2;
var slidersHeight = fringeSliders.clientHeight;

var dragStarts = [];
var dragPositions = [
  slidersHeight - 5 * sliderBoxHeight - 1,
  slidersHeight - 4 * sliderBoxHeight - 1,
  slidersHeight - 3 * sliderBoxHeight - 1,
  slidersHeight - 2 * sliderBoxHeight - 1,
  slidersHeight - 1 * sliderBoxHeight - 1
];
var percentPositions = [100, 100, 100, 100, 100];

var renderList = [
  {
    selectionWidth: 2.4,
    selectionHeight: 2.4,
    selectionX: -1.6,
    selectionY: -1.2
  }
];

function updateLayout() {
  if (window.innerWidth < window.innerHeight) {
    portrait();
  } else if (window.innerWidth < window.innerHeight + 260) {
    scaleCanvas();
  } else {
    fullHeight();
  }
}

resetSliders();
updateLayout();

window.onresize = () => {
  updateLayout();
};

function scaleCanvas() {
  size = window.innerWidth - 280;
  canvas.width = canvas.height = overlay.width = overlay.height = size;
  canvasContainer.style.height = canvasContainer.style.width = `${size}px`;
  if (size > 375) {
    fringeSliders.style.height = `${size - 60}px`;
    slidersHeight = fringeSliders.clientHeight;
  }
  canvasContainer.style.alignSelf = "flex-start";
  resetSliders();
}

function fullHeight() {
  size = window.innerHeight - 42;
  canvas.width = canvas.height = overlay.width = overlay.height = size;
  canvasContainer.style.height = canvasContainer.style.width = `${size}px`;
  fringeSliders.style.height = `${size - 60}px`;
  slidersHeight = fringeSliders.clientHeight;
  resetSliders();
}

function portrait() {
  size = window.innerWidth - 42;
  canvas.width = canvas.height = overlay.width = overlay.height = size;
  canvasContainer.style.height = canvasContainer.style.width = `${size}px`;
}

function mandelbrotCheck(x, y) {
  let real = x;
  let imag = y;

  for (let i = 0; i < iterations; i++) {
    let tempX = real * real - imag * imag + x;
    let tempY = 2 * real * imag + y;

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
  render();
}

function render() {
  let x = 0;
  frac.fillStyle = `#${backgroundColor.value}`;
  frac.fillRect(0, 0, canvas.width, canvas.height);
  selection.clearRect(0, 0, overlay.width, overlay.height);
  renderBtn.innerText = "Stop";
  resetBtn.disabled = true;
  backBtn.disabled = true;
  resetAllBtn.disabled = true;
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
          frac.fillStyle = `#${setColor.value}`;
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
      rendering = false;
      resetBtn.disabled = false;
      resetAllBtn.disabled = false;
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
  resetAllBtn.disabled = false;
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

function resetAll() {
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
  resetSliders();
  fringeColor1.value = "FFFFFF";
  fringeColor1.style.backgroundColor = "rgb(255, 255, 255)";
  fringeColor2.value = "FFFFFF";
  fringeColor2.style.backgroundColor = "rgb(255, 255, 255)";
  fringeColor3.value = "FFFFFF";
  fringeColor3.style.backgroundColor = "rgb(255, 255, 255)";
  fringeColor4.value = "FFFFFF";
  fringeColor4.style.backgroundColor = "rgb(255, 255, 255)";
  fringeColor5.value = "FFFFFF";
  fringeColor5.style.backgroundColor = "rgb(255, 255, 255)";
  backgroundColor.value = "FFFFFF";
  backgroundColor.style.backgroundColor = "rgb(255, 255, 255)";
  setColor.value = "000000";
  setColor.style.backgroundColor = "rgb(0, 0, 0)";
  iterations = iterSlider.value = iterDisplay.textContent = 500;
}

function resetSliders() {
  dragPositions = [
    slidersHeight - 5 * sliderBoxHeight - 1,
    slidersHeight - 4 * sliderBoxHeight - 1,
    slidersHeight - 3 * sliderBoxHeight - 1,
    slidersHeight - 2 * sliderBoxHeight - 1,
    slidersHeight - 1 * sliderBoxHeight - 1
  ];
  for (let n = 0; n < sliderBoxes.length; n++) {
    sliderBoxes[n].style.top = `${dragPositions[n]}px`;
  }
  percentPositions = [100, 100, 100, 100, 100];
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

//render();

for (let n = 0; n < dragPositions.length; n++) {
  dragBoxes[n].dragging = false;
  sliderBoxes[n].style.top = dragPositions[n] + "px";

  dragBoxes[n].addEventListener("mousedown", e => {
    dragBoxes[e.target.id].dragging = true;
    dragStarts[e.target.id] = e.offsetY;
  });
  dragBoxes[n].addEventListener("touchstart", e => {
    e.preventDefault();
    if (e.targetTouches.length == 1) {
      let touch = e.targetTouches[0];
      dragBoxes[touch.target.id].dragging = true;
      dragStarts[touch.target.id] = 15;
    }
  });
}

document.addEventListener("mousemove", e => {
  for (let n = 0; n < dragBoxes.length; n++) {
    if (dragBoxes[n].dragging == true) {
      let pos = e.clientY - dragStarts[n] - 20;
      if (
        pos > n * sliderBoxHeight + 2 &&
        pos < slidersHeight - 2 - (5 - n) * sliderBoxHeight + 2
      ) {
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

document.addEventListener("touchmove", e => {
  if (e.targetTouches.length == 1) {
    let touch = e.targetTouches[0];
    for (let n = 0; n < dragBoxes.length; n++) {
      if (dragBoxes[n].dragging == true) {
        let pos = touch.clientY - dragStarts[n] - 20;
        if (
          pos > n * sliderBoxHeight + 2 &&
          pos < slidersHeight - 2 - (5 - n) * sliderBoxHeight + 2
        ) {
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
  }
});

document.addEventListener("mouseup", () => {
  for (let n = 0; n < dragPositions.length; n++) {
    dragBoxes[n].dragging = false;
  }
});

document.addEventListener("touchend", () => {
  for (let n = 0; n < dragPositions.length; n++) {
    dragBoxes[n].dragging = false;
  }
});

function moveNextBox(n) {
  if (dragPositions[n] > dragPositions[n + 1] - sliderBoxHeight) {
    dragPositions[n + 1] = dragPositions[n] + sliderBoxHeight;
    sliderBoxes[n + 1].style.top = `${dragPositions[n + 1]}px`;
    calculatePosition(n + 1, sliderBoxes[n + 1].style.top);
  }
}
function movePrevBox(n) {
  if (dragPositions[n] < dragPositions[n - 1] + sliderBoxHeight) {
    dragPositions[n - 1] = dragPositions[n] - sliderBoxHeight;
    sliderBoxes[n - 1].style.top = `${dragPositions[n - 1]}px`;
    calculatePosition(n - 1, sliderBoxes[n - 1].style.top);
  }
}

function calculatePosition(n, top) {
  top = Number(top.slice(0, -2));
  let range = slidersHeight - (5 - n) * sliderBoxHeight - n * sliderBoxHeight;
  let position = top - n * sliderBoxHeight - 3;
  let positionPercent = (100 / range) * position;
  percentPositions[n] = Math.floor(positionPercent) + 1;
}
