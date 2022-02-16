const {ipcRenderer, ipcMain} = require('electron');
const fs = require('fs');

ipcRenderer.on('initial', (event, initialData) => {
    console.log('Markers Loaded');
});

/* ipcRenderer.send('resync', newData); */
