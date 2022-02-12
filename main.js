const { app, BrowserWindow, globalShortcut } = require("electron");

var mainWindow;
let data = {
  width: 600,
  height: 56,
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
  symmetrical: false,
  markers: 3,
  showSizes: false,
  kiosk: false
}

function updateWindow() {
  mainWindow.setSize(data.width, data.height);
  mainWindow.setPosition(data.x, data.y);
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
    opacity: theme.opacity,
    minWidth: 48,
    minHeight: 56,
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

  mainWindow.on('resize', () => {
    updateData()
    mainWindow.webContents.send("sendControls", controls, data);
  });

  updateData()
  setupKeys(globalShortcut);
});

app.on("moved", (e) => {
  console.log(e);
})

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
  globalShortcut.register("Alt+F", () => {
    updateData()
    theme.flipped = !theme.flipped;
    /* let size = mainWindow.getSize()
    data.width = size[1];
    data.height = size[0]; */
    mainWindow.webContents.send("sendTheme", theme);
    updateWindow()
  });
  globalShortcut.register("Alt+PageUp", () => {
    theme.flipped = !theme.flipped;
    theme.opacity += (theme.opacity < 1) ? 0.05 : 0;
    updateOpacity()
  });
  globalShortcut.register("Alt+PageDown", () => {
    theme.flipped = !theme.flipped;
    theme.opacity -= (theme.opacity > 0.1) ? 0.05 : 0;
    updateOpacity()
  });

  // controls data
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
  globalShortcut.register("Alt+K", () => {
    updateData()
    controls.kiosk = !controls.kiosk
    mainWindow.kiosk = controls.kiosk
    if(controls.kiosk){
      mainWindow.setIgnoreMouseEvents(true)
    }else{
      mainWindow.setIgnoreMouseEvents(false)
    }
    sendControls(controls, data)
  });
  // 
  globalShortcut.register("Shift+numadd", () => {

  });
  globalShortcut.register("Shift+numsub", () => {
    
  });
  // Symmetrical ruler
  globalShortcut.register("Alt+num0", () => {
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