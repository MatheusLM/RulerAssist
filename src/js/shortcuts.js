const { globalShortcut, ipcMain, ipcRenderer } = require('electron');
const fs = require('fs');

var shortcuts = true;
var path = require('path');
var pathToFile = path.join(__dirname, '../data.json');
var data;

function getData() {
    data = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
}
function setData() {
    fs.writeFileSync(pathToFile, JSON.stringify(data));
}

function setupKeys() {
    getData();
    globalShortcut.register('Alt+S', () => {
        shortcuts = !shortcuts;
        console.log('[Shortcut] enabled:', shortcuts);
    });

    globalShortcut.register('Alt+C', () => {
        if (!shortcuts) return;
        data.window.controls = !data.window.controls;
        setData();
        ipcMain.emit('syncControls');
    });

    globalShortcut.register('Alt+D', () => {
        if (!shortcuts) return;
        data.grid.dark = !data.grid.dark;
        setData();
        ipcMain.emit('updateDarkMode');
    });

    globalShortcut.register('Alt+T', () => {
        if (!shortcuts) return;
        data.window.alwaysOnTop = !data.window.alwaysOnTop;
        setData();
        ipcMain.emit('updateAlwaysOnTop');
    });

    globalShortcut.register('Alt+Q', () => {
        if (!shortcuts) return;
        ipcMain.emit('closeRuler');
    });
}

console.log('[Loaded] shortcuts');
module.exports = setupKeys;
