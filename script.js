const { ipcRenderer, ipcMain } = require('electron')

let windowPosition = {}
let x = 0;
let y = 0;
let multiplier = 1;
let ruler = document.getElementById('ruler')

window.addEventListener('keydown', (e) => {
  if (e.code === 'ShiftLeft') multiplier = 5
  if (e.code === 'ArrowDown')  y = 1*multiplier 
  if (e.code === 'ArrowUp')  y = -1*multiplier 
  if (e.code === 'ArrowRight')  x = 1*multiplier 
  if (e.code === 'ArrowLeft ')  x = -1*multiplier 
  let data = {
    width: 450,
    height: 600,
    x: x,
    y: y,
  }
  ipcRenderer.send('ping', data)
})


ipcRenderer.on('pong', (event, data) => {
  windowPosition = data
  console.log(windowPosition);
})