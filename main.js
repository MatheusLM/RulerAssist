const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');

var mainWindow;
let data = {
    width: 600,
    height: 56,
    x: 660,
    y: 512
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        minWidth: 56,
        minHeight: 56,
        maxWidth: 1920,
        maxHeight: 1080,
        alwaysOnTop: true,
        frame: false,
        transparent: true
    });

    /* mainWindow.webContents.openDevTools(true); */
    updateWindow();
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
