const { ipcRenderer, ipcMain } = require('electron')

let frame = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
}
let ruler = document.getElementById('ruler')

window.addEventListener('keydown', (e) => {
  ipcRenderer.send('getData');
  ipcRenderer.on('sendData', (event, data) => {
    frame = data
         if (e.code === 'ArrowDown') {frame.y += 1}
    else if (e.code === 'ArrowUp') {frame.y -= 1}
    else if (e.code === 'ArrowRight') {frame.x += 1}
    else if (e.code === 'ArrowLeft ') {frame.x -= 1}
    ipcRenderer.send('changeData', frame);
  })
})

window.addEventListener('wheel', (e) => {
  ipcRenderer.send('getData');
  ipcRenderer.on('sendData', (event, data) => {
    var dir = Math.sign(e.deltaY);
    data.width -= dir

    ipcRenderer.send('changeData', data);
  })
})