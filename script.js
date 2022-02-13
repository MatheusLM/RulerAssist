const { ipcRenderer, ipcMain } = require("electron");

let theme = {};
let data = {};
let controls = {};
let rulerData = {};

let stepSize = 0;

const html = document.getElementById("html");
const body = document.getElementById("body");

const ruler = document.getElementById("ruler");
const markers = document.getElementById("markers");
const controlsPanel = document.getElementById("controls");

const rulerEquivalent = document.getElementById("rulerEquivalent");

ipcRenderer.on("sync", (event, newTheme, newData, newControls, newRulerData) => {
  theme = newTheme;
  data = newData;
  controls = newControls;
  rulerData = newRulerData;
  rulerEquivalent.value = rulerData.equivalent;
});

ipcRenderer.on("syncRuler", (event, newRulerData) => {
  rulerData = newRulerData;
  rulerEquivalent.value = rulerData.equivalent;
  markers.style.backgroundColor = (rulerData.equivalentRuler) ? "rgba(200,255,200,0.65)" : "rgba(255,255,255,0.65)"
});

ipcRenderer.on("sendTheme", (event, newData) => {
  theme = newData;
  ruler.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
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
    stepSize = (rulerData.equivalentRuler) ? (rulerData.equivalent/2) / markersCount : data.width / markersCount;
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
  console.log(rulerData);
})