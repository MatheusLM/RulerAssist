const {ipcRenderer, ipcMain} = require('electron');

let theme = {};
let data = {};
let controls = {};
let rulerData = {};
let gridData = {};

ipcRenderer.on('sync', (event, data) => {});

ipcRenderer.send('resync', newData);
