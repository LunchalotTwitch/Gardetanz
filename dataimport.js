let importData = {}; // Object to store imported data

function fetchImportData() {
    const savedData = localStorage.getItem('importData');
    if (savedData) {
        importData = JSON.parse(savedData);
        populateImportTable();
    }
}

function populateImportTable() {
    const tableBody = document.querySelector('#importTable tbody');
    tableBody.innerHTML = '';

    for (const key in importData) {
        const data = importData[key];
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${data.tournament}</td>
            <td>${data.date}</td>
            <td>${data.ageGroup}</td>
            <td>${data.discipline}</td>
            <td>${data.startNumber}</td>
            <td>${data.club}</td>
            <td>${data.starterName}</td>
        `;

        tableBody.appendChild(row);
    }
}

function importExcelData() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            importData = {}; // Reset import data
            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                if (row.length >= 7) { // Ensure all required columns are present
                    const key = row[4].toString().trim(); // Assuming start number as the key
                    importData[key] = {
                        tournament: row[0].toString().trim(),
                        date: row[1].toString().trim(),
                        ageGroup: row[2].toString().trim(),
                        discipline: row[3].toString().trim(),
                        startNumber: row[4].toString().trim(),
                        club: row[5].toString().trim(),
                        starterName: row[6].toString().trim()
                    };
                }
            });
            localStorage.setItem('importData', JSON.stringify(importData));
            populateImportTable();
            fileInput.value = ''; // Clear the file input
        };
        reader.readAsArrayBuffer(file);
    }
}

function deleteAllImportData() {
    importData = {};
    localStorage.removeItem('importData');
    populateImportTable();
}

window.onload = () => {
    fetchImportData();
};
