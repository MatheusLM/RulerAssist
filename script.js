const { ipcRenderer, ipcMain } = require("electron");

let theme = {};
let data = {};
let controls = {};
let rulerData = {};
let gridData = {};

let stepSize = 0;

const html = document.getElementById("html");
const body = document.getElementById("body");

const ruler = document.getElementById("ruler");
const markers = document.getElementById("markers");
const controlsRuler = document.getElementById("controlsRuler");

const rulerEquivalent = document.getElementById("rulerEquivalent");

const controlsGrid = document.getElementById("controlsGrid");
const grid = document.getElementById("grid");
const gridContainer = document.getElementById("gridContainer");
const gridRows = document.getElementById("gridRows");
const gridColumns = document.getElementById("gridColumns");
const gridWidth = document.getElementById("gridWidth");
const gridHeight = document.getElementById("gridHeight");
const gridWidthEquivalent = document.getElementById("gridWidthEquivalent");
const gridHeightEquivalent = document.getElementById("gridHeightEquivalent");
const gridX = document.getElementById("gridX");
const gridY = document.getElementById("gridY");

const gridHorizontal = document.getElementById("horizontal");
const gridVertical = document.getElementById("vertical");

ipcRenderer.on("sync", (event, newTheme, newData, newControls, newRulerData, newGridData) => {
  theme = newTheme;
  data = newData;
  controls = newControls;
  rulerData = newRulerData;
  gridData = newGridData
  rulerEquivalent.value = rulerData.equivalent;
  grid.style.visibility = (gridData.show) ? "visible" : "hidden"
  ruler.style.visibility = (!gridData.show) ? "visible" : "hidden"
  updateGrid()
});

ipcRenderer.on("syncRuler", (event, newRulerData) => {
  rulerData = newRulerData;
  rulerEquivalent.value = rulerData.equivalent;
  markers.style.backgroundColor = (rulerData.equivalentRuler) ? "rgba(160,255,160,0.65)" : "transparent"
});

ipcRenderer.on("syncGrid", (event, newGridData) => {
  gridData = newGridData;
  grid.style.visibility = (gridData.show) ? "visible" : "hidden"
  ruler.style.visibility = (!gridData.show) ? "visible" : "hidden"
  gridRows.value = gridData.rows
  gridColumns.value = gridData.columns
  gridWidth.value = gridData.width
  gridHeight.value = gridData.height
  gridWidthEquivalent.value = gridData.widthEquivalent
  gridHeightEquivalent.value = gridData.heightEquivalent
  gridX.value = gridData.x
  gridY.value = gridData.y
  updateGrid()
});

ipcRenderer.on("sendTheme", (event, newData) => {
  theme = newData;
  
  grid.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
  ruler.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';

  // Rotates
  html.style.transform = (theme.rotated) ? 'rotateZ(-180deg)' : '';
  controlsGrid.style.transform = (theme.rotated) ? 'rotateZ(-180deg)' : '';
  controlsRuler.style.transform = (theme.rotated) ? 'rotateZ(-180deg)' : '';
});

ipcRenderer.on("sendControls", (event, newControls, newData) => {
  controls = newControls
  data = newData

  // MARKERS
  stepSize = (rulerData.equivalentRuler) ? rulerData.equivalent / controls.markers : data.width / controls.markers;
  
  let markersNumber = []
  markers.innerHTML = ''
  if(controls.symmetrical){
    let markersCount = Math.ceil(controls.markers/2)
    stepSize = (rulerData.equivalentRuler) ? (rulerData.equivalent/2) / markersCount : (data.width / 2) / markersCount;
    for (let i = markersCount; i > 0; i--){
      markersNumber.push(i)
    }
    markersNumber.push(0)
    for (let i = 1; i <= markersCount; i++){
      markersNumber.push(i)
    }
  }else{
    for (let i = 0; i <= controls.markers; i++){
      markersNumber.push(i)
    }
  }
  for (let i = 0; i < markersNumber.length; i++){
    let step = markersNumber[i]
    let spanText = (controls.showSizes) ? step + ':' + Math.floor(step*stepSize) : step
    let div = document.createElement("div")
    let span = document.createElement("span")
    let text = span.append(spanText)
    div.className = "marker"
    div.append(span)
    markers.append(div)
  }

  // CONTROLS PANEL
  verifyControls()
  updateGrid()
  
});

rulerEquivalent.addEventListener('input', (e) => {
  rulerData.equivalent = rulerEquivalent.value
  ipcRenderer.send('resyncRuler', rulerData)
})

let a = [gridRows, gridColumns, gridWidth, gridHeight, gridWidthEquivalent, gridHeightEquivalent, gridX, gridY].forEach( (e) => {
  e.addEventListener('input', (e) => {
    gridData.rows = gridRows.value
    gridData.columns = gridColumns.value
    gridData.width = gridWidth.value
    gridData.height = gridHeight.value
    gridData.widthEquivalent = gridWidthEquivalent.value
    gridData.heightEquivalent = gridHeightEquivalent.value
    gridData.x = gridX.value
    gridData.y = gridY.value
    updateGrid()
    ipcRenderer.send('resyncGrid', gridData)
  })
})

function verifyControls(){
  if (controls.showControls){
    if(gridData.show){
      controlsRuler.style.visibility = 'hidden'
      controlsGrid.style.visibility = 'visible'
    }else{
      controlsRuler.style.visibility = 'visible'
      controlsGrid.style.visibility = 'hidden'
    }
  }else{
    controlsRuler.style.visibility = 'hidden'
      controlsGrid.style.visibility = 'hidden'
  }
}

function updateGrid(){
  gridContainer.style.width = gridData.width+'px'
  gridContainer.style.height = gridData.height+'px'
  gridContainer.style.marginLeft = gridData.x+'px'
  gridContainer.style.marginTop = gridData.y+'px'
  updateGridLines()
  verifyControls()
}
function updateGridLines(){
  gridHorizontal.innerHTML = ''
  let stepHeight = (rulerData.equivalentRuler) ? gridData.heightEquivalent / gridData.rows : gridData.height / gridData.rows;
  let stepWidth = (rulerData.equivalentRuler) ? gridData.widthEquivalent / gridData.columns : gridData.width / gridData.columns;
  
  for(let step=0; step<=gridData.rows; step++){
    let div = document.createElement('div')
    let text = document.createElement('span')
    let heightText = (controls.showSizes) ? step + ':' + Math.floor(step*stepHeight) : step
    text.append(heightText)
    div.append(text)
    div.className = 'horizontal-line'
    gridHorizontal.append(div)
  }
  gridVertical.innerHTML = ''
  for(let step=0; step<=gridData.columns; step++){
    let div = document.createElement('div')
    let text = document.createElement('span')
    let widthText = (controls.showSizes) ? step + ':' + Math.floor(step*stepWidth) : step
    text.append(widthText)
    div.append(text)
    div.className = 'vertical-line'
    gridVertical.append(div)
  }
}