const { ipcRenderer } = require("electron");

let frame = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const ruler = document.getElementById("ruler");

ipcRenderer.on("sendData", (event, data) => {
  frame = data;
  console.log(frame);
});
