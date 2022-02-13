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
const controlsPanel = document.getElementById("controls");

const rulerEquivalent = document.getElementById("rulerEquivalent");

const grid = document.getElementById("grid");
const gridContainer = document.getElementById("gridContainer");
const gridRows = document.getElementById("gridRows");
const gridColumns = document.getElementById("gridColumns");
const gridWidth = document.getElementById("gridWidth");
const gridHeight = document.getElementById("gridHeight");
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
  gridX.value = gridData.x
  gridY.value = gridData.y
  updateGrid()
});

ipcRenderer.on("sendTheme", (event, newData) => {
  theme = newData;
  ruler.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
  grid.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
  html.style.transform = (theme.rotated) ? 'rotateZ(-180deg)' : '';
  /* html.style.width = (theme.rotated) ? '100vh' : '100vw';
  html.style.height = (theme.rotated) ? '100vw' : '100vh'; */
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
  controlsPanel.style.visibility = (controls.showControls) ? 'visible' : 'hidden';
  
});

rulerEquivalent.addEventListener('input', (e) => {
  rulerData.equivalent = rulerEquivalent.value
  ipcRenderer.send('resyncRuler', rulerData)
})

let a = [gridRows, gridColumns, gridWidth, gridHeight, gridX, gridY].forEach( (e) => {
  e.addEventListener('input', (e) => {
    gridData.rows = gridRows.value
    gridData.columns = gridColumns.value
    gridData.width = gridWidth.value
    gridData.height = gridHeight.value
    gridData.x = gridX.value
    gridData.y = gridY.value
    updateGrid()
    ipcRenderer.send('resyncGrid', gridData)
  })
} )

function updateGrid(){
  gridContainer.style.width = gridData.width+'px'
  gridContainer.style.height = gridData.height+'px'
  gridContainer.style.marginLeft = gridData.x+'px'
  gridContainer.style.marginTop = gridData.y+'px'
  updateGridLines()
}
function updateGridLines(){
  gridHorizontal.innerHTML = ''
  for(let i=0; i<gridData.rows; i++){
    let div = document.createElement('div')
    let text = document.createElement('span')
    text.append(parseInt(i+1))
    div.append(text)
    div.className = 'horizontal-line'
    gridHorizontal.append(div)
  }
  gridVertical.innerHTML = ''
  for(let i=0; i<gridData.columns; i++){
    let div = document.createElement('div')
    let text = document.createElement('span')
    text.append(parseInt(i+1))
    div.append(text)
    div.className = 'vertical-line'
    gridVertical.append(div)
  }
}