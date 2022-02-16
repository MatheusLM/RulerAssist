const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');
console.log('[Loaded] Markers');

ipcRenderer.on('initial', (event, initialData) => {});

/* ipcRenderer.send('resync', newData); */
