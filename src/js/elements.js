const { ipcRenderer, ipcMain } = require('electron');
const fs = require('fs');

ipcRenderer.on('initial', (event, initialData) => {
    getData();
    elements['width'].value = data['grid'].width;
    elements['widthEquivalent'].value = data['grid'].widthEquivalent;
    elements['height'].value = data['grid'].height;
    elements['heightEquivalent'].value = data['grid'].heightEquivalent;
    elements['rows'].value = data['grid'].rows;
    elements['columns'].value = data['grid'].columns;
    elements['equivalent'].checked = data['grid'].equivalent;
    elements['symmetrical'].checked = data['grid'].symmetrical;
    elements['dark'].checked = data['grid'].dark;
    elements['rotate'].checked = data['grid'].rotate;
    elements['top'].checked = data['grid'].top;
});

const elements = {
    width: document.getElementById('width'),
    widthEquivalent: document.getElementById('widthEquivalent'),
    height: document.getElementById('height'),
    heightEquivalent: document.getElementById('heightEquivalent'),
    rows: document.getElementById('rows'),
    columns: document.getElementById('columns'),
    equivalent: document.getElementById('equivalent'),
    symmetrical: document.getElementById('symmetrical'),
    dark: document.getElementById('dark'),
    rotate: document.getElementById('rotate'),
    top: document.getElementById('top'),
};

console.log('[Loaded] Elements');
export default elements;

elements['height'].addEventListener('input', e => {
    data['grid']['height'] = Number(elements['height'].value);
    setData();
    ipcRenderer.send('resync');
});
