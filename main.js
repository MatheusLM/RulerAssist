const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcRenderer,
  ipcMain,
  remote,
} = require("electron");
var mainWindow;
let data = {
  width: 600,
  height: 400,
  x: 3100,
  y: 90,
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: data.width,
    height: data.height,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.webContents.openDevTools(true);
  mainWindow.setPosition(data.x, data.y);
  mainWindow.loadFile("./index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  globalShortcut.register("up", () => {
    data.y = mainWindow.getPosition[1] - 1;
    updateWindow(data);
    mainWindow.webContents.send("sendData", data);
  });
  globalShortcut.register("down", () => {
    data.y = mainWindow.getPosition[1] + 1;
    updateWindow(data);
    mainWindow.webContents.send("sendData", data);
  });
  globalShortcut.register("left", () => {
    data.x = mainWindow.getPosition[0] - 1;
    updateWindow(data);
    mainWindow.webContents.send("sendData", data);
  });
  globalShortcut.register("right", () => {
    data.x = mainWindow.getPosition[0] + 1;
    updateWindow(data);
    mainWindow.webContents.send("sendData", data);
  });
});

function updateWindow(data) {
  mainWindow.setSize(data.width, data.height);
  mainWindow.setPosition(data.x, data.y);
}

app.on("move", (event) => {
  console.log(event);
});
