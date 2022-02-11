const { app, BrowserWindow, Menu, ipcMain } = require('electron')
var mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
    width: 600,
    height: 750,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.webContents.openDevTools(true);
  mainWindow.setPosition(-650, 200)
  mainWindow.loadFile('./index.html')
  
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
ipcMain.on('getData', (event) => {
  let currentPos = mainWindow.getPosition()
  let currentSize = mainWindow.getSize()
  let data = {
    width: currentSize[0],
    height: currentSize[1],
    x: currentPos[0],
    y: currentPos[1]
  }
  event.reply('sendData', data);
})
ipcMain.on('changeData', (event, data) => {
  mainWindow.setSize(data.width, data.height)
  mainWindow.setPosition(data.x, data.y)
})