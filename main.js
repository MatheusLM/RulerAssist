const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");

var mainWindow;
let data = {
  width: 600,
  height: 56,
  x: 660,
  y: 512
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

let gridData = {
  show: false,
  width: 600,
  height: 600,
  columns: 5,
  rows: 5,
  x: 660,
  y: 240
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
  sendSync(theme, data, controls, rulerData, gridData)
  mainWindow.webContents.send("syncGrid", gridData);
  mainWindow.webContents.send("syncRuler", rulerData);
  updateWindow()
  mainWindow.loadFile("./index.html");
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("resyncRuler", (event, newRulerData) => {
    rulerData.equivalent = newRulerData.equivalent
    mainWindow.webContents.send("sendControls", controls, data);
  })

  ipcMain.on("resyncGrid", (event, newGridData) => {
    gridData = newGridData
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
    mainWindow.webContents.send("sendControls", controls, data);
    updateWindow()
  })
  mainWindow.on("blur", () => {
    controls.showControls = false;
    data.height -= (data.height > 96) ? 0 : 40;
    mainWindow.webContents.send("sendControls", controls, data);
    updateWindow()
  })

  updateData()
  setupKeys(globalShortcut);
});

function sendControls(controls, data){
  mainWindow.webContents.send("sendControls", controls, data);
}
function sendSync(theme, data, controls, rulerData, gridData){
  mainWindow.webContents.send("sync", theme, data, controls, rulerData, gridData);
}

function setupKeys(globalShortcut){
  // Fast mode
  globalShortcut.register("Scrolllock", () => {
    controls.fast = !controls.fast;
    controls.modifier = (controls.fast)? 10 : 1;
  });
  // Window position
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

  // Theme toggle
  globalShortcut.register("Alt+T", () => {
    updateData()
    theme.dark = !theme.dark;
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  // Window rotate
  globalShortcut.register("Alt+R", () => {
    updateData()
    theme.rotated = !theme.rotated;
    /* let size = mainWindow.getSize()
    data.width = size[1];
    data.height = size[0]; */
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  // Window opacity
  globalShortcut.register("Alt+PageUp", () => {
    theme.opacity += (theme.opacity < 1) ? 0.05 : 0;
    updateOpacity()
  });
  globalShortcut.register("Alt+PageDown", () => {
    theme.opacity -= (theme.opacity > 0.1) ? 0.05 : 0;
    updateOpacity()
  });

  // Size controls
  globalShortcut.register("Alt+numadd", () => {
    updateData()
    data.width += controls.modifier;
    updateWindow()
    sendControls(controls, data)
  });
  globalShortcut.register("Alt+numsub", () => {
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

  // Clickable control
  globalShortcut.register("Alt+num0", () => {
    updateData()
    controls.clickable = !controls.clickable
    updateClickable(controls.clickable)
  });

  // Kiosk controls
  globalShortcut.register("Alt+F", () => {
    updateData()
    controls.kiosk = !controls.kiosk
    mainWindow.kiosk = controls.kiosk
    updateClickable(controls.kiosk)
    sendControls(controls, data)
  });
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
  // Show steps size
  globalShortcut.register("Alt+Enter", () => {
    updateData()
    controls.showSizes = !controls.showSizes
    sendControls(controls, data)
  });

  // Grid controls
  globalShortcut.register("Alt+G", () => {
    gridData.show = !gridData.show
    mainWindow.kiosk = gridData.show
    updateClickable(gridData.show)
    sendControls(controls, data)
    mainWindow.webContents.send("syncGrid", gridData);
  });
  // Grid controls rows and columns
  globalShortcut.register("CmdOrCtrl+Insert", () => {
    if (gridData.columns < 30){ gridData.columns += 1 }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+Delete", () => {
    if (gridData.columns > 0){ gridData.columns -= 1 }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+Shift+Insert", () => {
    if (gridData.rows < 30){ gridData.rows += 1 }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+Shift+Delete", () => {
    if (gridData.rows > 0){ gridData.rows -= 1 }
    mainWindow.webContents.send("syncGrid", gridData);
  });

  // Grid controls position
  globalShortcut.register("CmdOrCtrl+up", () => {
    if ((gridData.y - controls.modifier) > 0){
      gridData.y -= controls.modifier
    }else{
      gridData.y = 1
    }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+down", () => {
    if ((gridData.y + controls.modifier) < data.height - gridData.height){
      gridData.y += controls.modifier
    }else{
      gridData.y = data.height - gridData.height - 1
    }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+left", () => {
    if ((gridData.x - controls.modifier) > 0){
      gridData.x -= controls.modifier
    }else{
      gridData.x = 1
    }
    mainWindow.webContents.send("syncGrid", gridData);
  });
  globalShortcut.register("CmdOrCtrl+right", () => {
    if ((gridData.x + controls.modifier) < data.width - gridData.width){
      gridData.x += controls.modifier
    }else{
      gridData.x = data.width - gridData.width - 1
    }
    mainWindow.webContents.send("syncGrid", gridData);
  });
}