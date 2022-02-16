const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');
console.log('[Loaded] Shortcuts');

ipcRenderer.on('initial', (event, initialData) => {});
