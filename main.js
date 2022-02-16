const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');
var path = require('path');
var pathToFile = path.join(__dirname, '/src/', 'data.json');
var data;
/* fs.writeFileSync('C:/Users/Matheus/Documents/projects/ruler/src/data.json', 'Hey there!'); */
function getData() {
    data = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
}
function setData() {
    fs.writeFileSync(pathToFile, JSON.stringify(data));
}

var mainWindow;
const createWindow = () => {
    getData();
    setData();
    newScreen = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
        },
        width: data.window.width,
        minWidth: data.window.minWidth,
        maxWidth: data.window.maxWidth,
        height: data.window.height,
        minHeight: data.window.minHeight,
        maxHeight: data.window.maxHeight,
        opacity: data.window.opacity,
        frame: false,
        transparent: true,
        alwaysOnTop: data.window.alwaysOnTop,
    });

    newScreen.setPosition(data.window.x, data.window.y);
    newScreen.loadFile('./src/index.html');
    newScreen.webContents.openDevTools(true);
    newScreen.on('ready-to-show', () => {
        newScreen.webContents.send('initial', String(pathToFile));
    });
};

app.whenReady().then(() => {
    mainWindow = createWindow();
    ipcMain.on('resync', (event, newRulerData) => {});

    mainWindow.on('resize', () => {});
    mainWindow.on('will-move', () => {});
    mainWindow.on('focus', () => {});
    mainWindow.on('blur', () => {});

    updateData();
    setupKeys(globalShortcut);
});

function setupKeys(globalShortcut) {
    // Create a shortcut
    globalShortcut.register('Alt+Q', () => {
        console.log('Shortcut: Alt+Q');
    });
}
