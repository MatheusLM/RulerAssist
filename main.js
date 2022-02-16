const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const fs = require('fs');
var path = require('path');
var pathToFile = path.join(__dirname, '/src/', 'data.json');
/* fs.writeFileSync('C:/Users/Matheus/Documents/projects/ruler/src/data.json', 'Hey there!'); */

var mainWindow;

const createWindow = () => {
    newScreen = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false
        },
        width: 600,
        height: 56,
        minWidth: 300,
        minHeight: 56,
        maxWidth: 1920,
        maxHeight: 1080,
        frame: false,
        transparent: true
        /* alwaysOnTop: true */
    });

    newScreen.setPosition(-720, 100);
    newScreen.loadFile('./src/index.html');
    /* newScreen.webContents.openDevTools(true); */
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
