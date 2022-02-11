const { app, BrowserWindow, Menu, ipcMain } = require('electron')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 150,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  /* mainWindow.webContents.openDevTools(true); */
  mainWindow.setPosition(-700, 200)
  mainWindow.loadFile('./index.html')
  ipcMain.on('ping', (event, data) => {
    let currentPos = mainWindow.getPosition()
    let currentSize = mainWindow.getSize()
    mainWindow.setSize(data.width, data.height)
    mainWindow.setPosition(parseInt(currentPos[0] - data.x), parseInt(currentPos[1] - data.y))
    let newData = {
      width: data.width,
      height: data.height,
      x: data.x,
      y: data.y
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})