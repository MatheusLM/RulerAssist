const { app, BrowserWindow, globalShortcut } = require("electron");

var mainWindow;
let data = {
  width: 600,
  height: 60,
  x: 300,
  y: 970
};

let theme = {
  dark: true,
  flipped: false,
  opacity: 0.9
}

let controls = {
  fast: false,
  modifier: 1,
  centered: true,
  markers: 3,
  kiosk: false
}

function updateData() {
  let pos = mainWindow.getPosition()
  let size = mainWindow.getSize()
  data = {
    width: size[0],
    height: size[1],
    x: pos[0],
    y: pos[1]
  }
}
function updateOpacity(){
  mainWindow.setOpacity(theme.opacity)
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: data.width,
    height: data.height,
    opacity: theme.opacity,
    minWidth: 60,
    minHeight: 60,
    maxWidth: 1920,
    maxHeight: 1080,
    alwaysOnTop: true,
    frame: false,
    transparent: true
  });

  /* mainWindow.webContents.openDevTools(true); */
  updateWindow()
  mainWindow.loadFile("./index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  setupKeys(globalShortcut);
});

function updateWindow() {
  mainWindow.setSize(data.width, data.height);
  mainWindow.setPosition(data.x, data.y);
}

app.on("moved", (e) => {
  console.log(e);
})

function setupKeys(globalShortcut){
  // window data
  globalShortcut.register("CmdOrCtrl+up", () => {
    updateData();
    data.y -= controls.modifier;
    updateWindow()
  });
  globalShortcut.register("CmdOrCtrl+down", () => {
    updateData();
    data.y += controls.modifier;
    updateWindow()
  });
  globalShortcut.register("CmdOrCtrl+left", () => {
    updateData();
    data.x -= controls.modifier;
    updateWindow()
  });
  globalShortcut.register("CmdOrCtrl+right", () => {
    updateData();
    data.x += controls.modifier;
    updateWindow()
  });

  // theme data
  globalShortcut.register("Alt+num1", () => {
    theme.flipped = !theme.flipped;
    let size = mainWindow.getSize()
    data.width = size[1];
    data.height = size[0];
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  globalShortcut.register("Alt+num0", () => {
    theme.dark = !theme.dark;
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  globalShortcut.register("Alt+numadd", () => {
    theme.flipped = !theme.flipped;
    theme.opacity += (theme.opacity < 1) ? 0.05 : 0;
    updateOpacity()
  });
  globalShortcut.register("Alt+numsub", () => {
    theme.flipped = !theme.flipped;
    theme.opacity -= (theme.opacity > 0.1) ? 0.05 : 0;
    updateOpacity()
  });

  // controls data
  globalShortcut.register("Scrolllock", () => {
    controls.fast = !controls.fast;
    controls.modifier = (controls.fast)? 10 : 1;
  });
  globalShortcut.register("CmdOrCtrl+numadd", () => {
    data.width += controls.modifier;
    updateWindow()
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
  globalShortcut.register("CmdOrCtrl+numsub", () => {
    data.width -= controls.modifier;
    updateWindow()
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
  globalShortcut.register("CmdOrCtrl+Shift+numadd", () => {
    controls.markers += 1;
    updateWindow()
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
  globalShortcut.register("CmdOrCtrl+Shift+numsub", () => {
    controls.markers += 1;
    updateWindow()
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
  globalShortcut.register("CmdOrCtrl+Shift+K", () => {
    controls.kiosk = !controls.kiosk
    mainWindow.kiosk = controls.kiosk
    if(controls.kiosk){
      mainWindow.setIgnoreMouseEvents(true)
    }else{
      mainWindow.setIgnoreMouseEvents(false)
    }
  });
  globalShortcut.register("Shift+numadd", () => {
    controls.markers += (controls.markers < 30) ? 1 : 0
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
  globalShortcut.register("Shift+numsub", () => {
    controls.markers -= (controls.markers > 1) ? 1 : 0
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });
}