const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');

var mainWindow;
let data = {
    width: 650,
    height: 200,
    x: -720,
    y: 100
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        width: data.width,
        height: data.height,
        minWidth: 56,
        minHeight: 56,
        maxWidth: 1920,
        maxHeight: 1080
        /* alwaysOnTop: true */
        /* frame: false */
        /* transparent: true */
    });

    mainWindow.setPosition(data.x, data.y);
    /* mainWindow.webContents.openDevTools(true); */
    mainWindow.on('ready-to-show', () => {
        // Initial configuration
    });
    mainWindow.loadFile('./src/index.html');
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('event_received', (event, newRulerData) => {});

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
