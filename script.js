const { ipcRenderer } = require("electron");

let theme = {
  dark: true,
  flipped: false
};
let data;
let controls;

const ruler = document.getElementById("ruler");
const container = document.getElementById("container");
const markers = document.getElementById("markers");
const html = document.getElementById("html");
const body = document.getElementById("body");

ipcRenderer.on("sendTheme", (event, newData) => {
  theme = newData;
  html.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
  html.style.transform = (theme.flipped) ? 'rotateZ(-180deg)' : '';
  /* html.style.width = (theme.flipped) ? '100vh' : '100vw';
  html.style.height = (theme.flipped) ? '100vw' : '100vh'; */
});

ipcRenderer.on("sendControls", (event, newControls, newData) => {
  controls = newControls
  data = newData

  let stepSize = Math.ceil(data.width / controls.markers)
  let markersNumber = []

  if(controls.symmetrical){
    let markersCount = Math.floor(controls.markers/2)
    stepSize = Math.ceil((data.width / 2) / markersCount)
    for (let i = markersCount; i > 0; i--){
      markersNumber.push(i)
    }
    markersNumber.push(0)
    for (let i = 1; i <= markersCount; i++){
      markersNumber.push(i)
    }
  }else{
    for (let i = 0; i < controls.markers; i++){
      markersNumber.push(i)
    }
  }
  
  markers.innerHTML = ''
  for (let i = 0; i < markersNumber.length; i++){
    let step = markersNumber[i]
    let spanText = (controls.showSizes) ? step + ':' + step*stepSize : step
    let div = document.createElement("div")
    let span = document.createElement("span")
    let text = span.append(spanText)
    div.className = "marker"
    div.append(span)
    markers.append(div)
  }
});