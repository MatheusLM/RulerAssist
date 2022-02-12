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

ipcRenderer.on("sendTheme", (event, data) => {
  theme = data;
  html.style.filter = (theme.dark) ? 'invert(0%)' : 'invert(100%)';
  html.style.transform = (theme.flipped) ? 'rotate(-90deg)' : 'rotate(0deg)';
  html.style.width = (theme.flipped) ? '100vh' : '100vw';
  html.style.height = (theme.flipped) ? '100vw' : '100vh';
});

ipcRenderer.on("sendControls", (event, newControls, newData) => {
  controls = newControls;
  data = newData
  let steps = parseInt(data.width / controls.markers)
  markers.innerHTML = ''
  for (let i = 0; i < controls.markers; i++) {
    let div = document.createElement("div")
    div.className = "marker"
    let span = document.createElement("span")
    let text = span.append(i + ':' + i*steps)
    div.append(span)
    markers.append(div)
  }
});