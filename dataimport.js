let importData = [];
let currentPage = 1;
const recordsPerPage = 20;

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        
        const keys = json[0];
        importData = json.slice(1).map(row => {
            let obj = {};
            row.forEach((cell, i) => {
                obj[keys[i]] = cell;
            });
            return obj;
        });

        localStorage.setItem('importData', JSON.stringify(importData));
        displayData();
    };

    reader.readAsArrayBuffer(file);
}

function displayData() {
    const tableBody = document.querySelector('#importedData tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, importData.length);

    importData.slice(startIndex, endIndex).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Turnier}</td>
            <td>${item.Datum}</td>
            <td>${item.Altersklasse}</td>
            <td>${item.Disziplin}</td>
            <td>${item.Startnummer}</td>
            <td>${item.Verein}</td>
            <td>${item['Name des Starters']}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = Math.ceil(importData.length / recordsPerPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayData();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(importData.length / recordsPerPage)) {
        currentPage++;
        displayData();
    }
}

function clearData() {
    localStorage.removeItem('importData');
    importData = [];
    displayData();
}

function importData() {
    const input = document.getElementById('fileInput');
    if (input.files.length > 0) {
        handleFileSelect({target: {files: input.files}});
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    const savedImportData = localStorage.getItem('importData');
    if (savedImportData) {
        importData = JSON.parse(savedImportData);
        displayData();
    }
};
