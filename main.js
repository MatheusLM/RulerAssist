const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const setupKeys = require('./src/js/shortcuts');
var path = require('path');
var pathToFile = path.join(__dirname, '/src/', 'data.json');
var data;

function emitInitial() {
    newScreen.webContents.send('initial', String(pathToFile));
}
function emitUpdateValues() {
    newScreen.webContents.send('updateValues');
}
function emitUpdateMarkers() {
    newScreen.webContents.send('updateMarkers');
}
function emitUpdateControls() {
    newScreen.webContents.send('updateControls', data);
}
function emitUpdateDarkMode() {
    newScreen.webContents.send('updateDarkMode', data);
    emitUpdateValues();
}
function getData() {
    data = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
}
function setData() {
    fs.writeFileSync(pathToFile, JSON.stringify(data));
    emitUpdateValues();
}

var mainWindow;
const createWindow = () => {
    getData();
    newScreen = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
        },
        width: data.grid.width,
        minWidth: data.window.minWidth,
        maxWidth: data.window.maxWidth,
        height: data.grid.height >= data.window.minHeight ? data.grid.height : data.window.minHeight,
        minHeight: data.window.minHeight,
        maxHeight: data.window.maxHeight,
        opacity: data.window.opacity,
        alwaysOnTop: data.window.alwaysOnTop,
        frame: false,
        transparent: true,
    });

    newScreen.setPosition(data.window.x, data.window.y);
    newScreen.loadFile('./src/index.html');
    newScreen.webContents.openDevTools(true);
    newScreen.on('ready-to-show', () => {
        emitInitial();
        setupKeys(data);
    });
    mainWindow = newScreen;
};

app.whenReady().then(() => {
    var mainWindow = createWindow();
    ipcMain.on('resync', (event, newData) => {
        getData();
        newScreen.setSize(data.grid.width, data.grid.height);
    });

    ipcMain.on('syncControls', (event, newData) => {
        getData();
        emitUpdateControls();
        newScreen.setIgnoreMouseEvents(!data.window.controls);
    });

    ipcMain.on('updateMarkers', (event, newData) => {
        getData();
        emitUpdateMarkers();
    });

    ipcMain.on('updateDarkMode', (event, newData) => {
        getData();
        emitUpdateDarkMode();
    });

    ipcMain.on('updateAlwaysOnTop', (event, newData) => {
        getData();
        newScreen.setAlwaysOnTop(data.window.alwaysOnTop);
    });

    ipcMain.on('closeRuler', (event, newData) => {
        app.quit();
    });

    newScreen.on('resized', () => {
        getData();
        let size = newScreen.getSize();
        if (size[1] < data.window.minHeight) {
            size[1] = data.window.minHeight;
        }
        data.grid.width = size[0];
        data.grid.height = size[1];
        setData();
        emitUpdateMarkers();
    });
    newScreen.on('moved', () => {
        getData();
        let position = newScreen.getPosition();
        data.window.x = position[0];
        data.window.y = position[1];
        setData();
    });
    newScreen.on('focus', () => {});
    newScreen.on('blur', () => {});
});
