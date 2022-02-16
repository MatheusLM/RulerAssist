const {ipcRenderer, ipcMain} = require('electron');
const fs = require('fs');

ipcRenderer.on('initial', (event, initialData) => {
    console.log('Shortcuts Loaded');
});
