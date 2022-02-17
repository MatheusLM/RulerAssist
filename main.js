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
        alwaysOnTop: data.window.alwaysOnTop,
        frame: false,
        transparent: true,
    });

    newScreen.setPosition(data.window.x, data.window.y);
    newScreen.loadFile('./src/index.html');
    newScreen.webContents.openDevTools(true);
    newScreen.on('ready-to-show', () => {
        newScreen.webContents.send('initial', String(pathToFile));
        /* setupKeys(); */
    });
    mainWindow = newScreen;
};

app.whenReady().then(() => {
    var mainWindow = createWindow();
    ipcMain.on('resync', (event, newData) => {
        getData();
        console.log(data);
    });

    newScreen.on('resized', () => {
        let size = newScreen.getSize();
        data.window.width = size[0];
        data.window.height = size[1];
        setData();
    });
    newScreen.on('moved', () => {
        let position = newScreen.getPosition();
        data.window.x = position[0];
        data.window.y = position[1];
        setData();
    });
    newScreen.on('focus', () => {});
    newScreen.on('blur', () => {});
});

function setupKeys() {
    // Create a shortcut
    globalShortcut.register('Alt+Q', () => {
        console.log('Shortcut: Alt+Q');
    });
}
