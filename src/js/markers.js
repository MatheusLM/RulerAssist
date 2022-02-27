const { ipcRenderer, ipcMain } = require('electron');

var horizontal = document.getElementById('horizontal');
var vertical = document.getElementById('vertical');

ipcRenderer.on('initial', (event, initialData) => {
    setupMarkers();
});

ipcRenderer.on('updateMarkers', (event, initialData) => {
    setupMarkers();
});

function setupMarkers() {
    horizontal.innerHTML = '';
    vertical.innerHTML = '';

    let height = data.grid.equivalent ? data.grid.heightEquivalent : data.grid.height;
    let width = data.grid.equivalent ? data.grid.widthEquivalent : data.grid.width;

    if (!data.grid.symmetrical) {
        let rowStep = height / data.grid.rows;
        let columnStep = width / data.grid.columns;
        for (var i = 0; i < data.grid.rows + 1; i++) {
            let div = document.createElement('div');
            let span = document.createElement('span');
            span.append(i, ':', Math.floor(rowStep * i));
            div.append(span);
            div.className = 'row';
            horizontal.append(div);
        }
        for (var i = 0; i < data.grid.columns + 1; i++) {
            let div = document.createElement('div');
            let span = document.createElement('span');
            span.append(i, ':', Math.floor(columnStep * i));
            div.append(span);
            div.className = 'column';
            vertical.append(div);
        }
    } else {
        let rows = Math.ceil(data.grid.rows / 2);
        let columns = Math.ceil(data.grid.columns / 2);

        let rowStep = height / 2 / rows;
        let columnStep = width / 2 / columns;

        var rowsArray = [];
        var columnsArray = [];

        for (var i = rows; i > 0; i--) rowsArray.push(i);
        for (var i = 0; i <= rows; i++) rowsArray.push(i);

        for (var i = 0; i < rowsArray.length; i++) {
            let div = document.createElement('div');
            let span = document.createElement('span');
            span.append(rowsArray[i], ':', Math.round(rowStep * rowsArray[i]));
            div.append(span);
            div.className = 'row';
            horizontal.append(div);
        }

        for (var i = columns; i > 0; i--) columnsArray.push(i);
        for (var i = 0; i <= columns; i++) columnsArray.push(i);

        for (var i = 0; i < columnsArray.length; i++) {
            let div = document.createElement('div');
            let span = document.createElement('span');
            span.append(columnsArray[i], ':', Math.round(columnStep * columnsArray[i]));
            div.append(span);
            div.className = 'column';
            vertical.append(div);
        }
    }
}

/* ipcRenderer.send('resync', newData); */
console.log('[Loaded] Markers');
