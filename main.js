const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");

var mainWindow;
let data = {
  width: 600,
  height: 56,
  x: 300,
  y: 970
};

let theme = {
  dark: true,
  rotated: false,
  opacity: 0.9
}

let rulerData = {
  equivalent: 1920,
  equivalentRuler: true
}

let controls = {
  fast: false,
  modifier: 1,
  symmetrical: true,
  markers: 3,
  showSizes: true,
  clickable: true,
  kiosk: false,
  showControls: true,
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
function updateWindow() {
  mainWindow.setSize(data.width, data.height);
  mainWindow.setPosition(data.x, data.y);
}
function updateOpacity(){
  mainWindow.setOpacity(theme.opacity)
}
function updateClickable(newData){
  mainWindow.setIgnoreMouseEvents(newData)
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    opacity: theme.opacity,
    minWidth: 48,
    minHeight: 56,
    maxWidth: 1920,
    maxHeight: 1080,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
  });

  /* mainWindow.webContents.openDevTools(true); */
  updateWindow()
  mainWindow.loadFile("./index.html");
};

app.whenReady().then(() => {
  createWindow();

  mainWindow.webContents.send("syncRuler", rulerData);
  mainWindow.webContents.send("sync", theme, data, controls, rulerData);

  ipcMain.on("resyncRuler", (event, newRulerData) => {
    rulerData.equivalent = newRulerData.equivalent
    mainWindow.webContents.send("sendControls", controls, data);
  })

  mainWindow.on('resize', () => {
    updateData()
    mainWindow.webContents.send("syncRuler", rulerData);
    mainWindow.webContents.send("sendControls", controls, data);
  });
  mainWindow.on("will-move", () => {
    updateData()
    updateWindow()
  })
  mainWindow.on("focus", () => {
    controls.showControls = true;
    updateData()
    data.height += (data.height <= 56) ? 40 : 0;
    updateWindow()
    mainWindow.webContents.send("sendControls", controls, data);
  })
  mainWindow.on("blur", () => {
    controls.showControls = false;
    data.height -= (data.height > 96) ? 0 : 40;
    updateWindow()
    mainWindow.webContents.send("sendControls", controls, data);
  })

  updateData()
  setupKeys(globalShortcut);
});

function sendControls(controls, data){
  mainWindow.webContents.send("sendControls", controls, data);
}

function setupKeys(globalShortcut){
  // window data
  globalShortcut.register("Alt+up", () => {
    updateData();
    data.y -= controls.modifier;
    updateWindow()
  });
  globalShortcut.register("Alt+down", () => {
    updateData();
    data.y += controls.modifier;
    updateWindow()
  });
  globalShortcut.register("Alt+left", () => {
    updateData();
    data.x -= controls.modifier;
    updateWindow()
  });
  globalShortcut.register("Alt+right", () => {
    updateData();
    data.x += controls.modifier;
    updateWindow()
  });

  // theme data
  globalShortcut.register("Alt+T", () => {
    updateData()
    theme.dark = !theme.dark;
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  globalShortcut.register("Alt+R", () => {
    updateData()
    theme.rotated = !theme.rotated;
    /* let size = mainWindow.getSize()
    data.width = size[1];
    data.height = size[0]; */
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  globalShortcut.register("Alt+PageUp", () => {
    theme.rotated = !theme.rotated;
    theme.opacity += (theme.opacity < 1) ? 0.05 : 0;
    updateOpacity()
  });
  globalShortcut.register("Alt+PageDown", () => {
    theme.rotated = !theme.rotated;
    theme.opacity -= (theme.opacity > 0.1) ? 0.05 : 0;
    updateOpacity()
  });

  // fast mode
  globalShortcut.register("Scrolllock", () => {
    controls.fast = !controls.fast;
    controls.modifier = (controls.fast)? 10 : 1;
  });
  // Size controls
  globalShortcut.register("CmdOrCtrl+numadd", () => {
    updateData()
    data.width += controls.modifier;
    updateWindow()
    sendControls(controls, data)
  });
  globalShortcut.register("CmdOrCtrl+numsub", () => {
    updateData()
    data.width -= controls.modifier;
    updateWindow()
    sendControls(controls, data)
  });
  // Markers controls
  globalShortcut.register("Alt+Insert", () => {
    updateData()
    let step = (controls.symmetrical) ? 2 : 1
    controls.markers += (controls.markers < 30) ? step : 0
    sendControls(controls, data)
    updateWindow()
  });
  globalShortcut.register("Alt+Delete", () => {
    updateData()
    let step = (controls.symmetrical) ? 2 : 1
    controls.markers -= (controls.markers > 2) ? step : 0
    sendControls(controls, data)
    updateWindow()
  });
  // Kiosk controls
  globalShortcut.register("Alt+F", () => {
    updateData()
    controls.kiosk = !controls.kiosk
    mainWindow.kiosk = controls.kiosk
    updateClickable(controls.kiosk)
    sendControls(controls, data)
  });
  // Clickable control
  globalShortcut.register("Alt+num0", () => {
    updateData()
    controls.clickable = !controls.clickable
    updateClickable(controls.clickable)
  });
  // 
  globalShortcut.register("Shift+numadd", () => {});
  globalShortcut.register("Shift+numsub", () => {});
  // Equivalent ruler
  globalShortcut.register("Alt+E", () => {
    updateData()
    rulerData.equivalentRuler = !rulerData.equivalentRuler
    mainWindow.webContents.send("syncRuler", rulerData);
    mainWindow.webContents.send("sendControls", controls, data);
  });
  // Symmetrical ruler
  globalShortcut.register("Alt+S", () => {
    updateData()
    controls.symmetrical = !controls.symmetrical
    sendControls(controls, data)
  });
  globalShortcut.register("Alt+Enter", () => {
    updateData()
    controls.showSizes = !controls.showSizes
    sendControls(controls, data)
  });
}