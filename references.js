let referenceData = {}; // Object to store reference data

function fetchReferenceData() {
    const savedData = localStorage.getItem('referenceData');
    if (savedData) {
        referenceData = JSON.parse(savedData);
        populateReferenceTable();
    }
}

function populateReferenceTable() {
    const tableBody = document.querySelector('#referenceTable tbody');
    tableBody.innerHTML = '';

    for (const key in referenceData) {
        const reference = referenceData[key];
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${reference.tournament}</td>
            <td>${reference.date}</td>
            <td>${reference.ageGroup}</td>
            <td>${reference.discipline}</td>
            <td>${reference.startNumber}</td>
            <td>${reference.club}</td>
            <td>${reference.starterName}</td>
            <td><button class="delete-button" onclick="deleteReference('${key}')">löschen</button></td>
        `;

        tableBody.appendChild(row);
    }
}

function importData() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            referenceData = {}; // Reset reference data
            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                if (row.length >= 7) { // Ensure all required columns are present
                    const key = row[4].toString().trim(); // Assuming start number as the key
                    referenceData[key] = {
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
            localStorage.setItem('referenceData', JSON.stringify(referenceData));
            populateReferenceTable();
            fileInput.value = ''; // Clear the file input
        };
        reader.readAsArrayBuffer(file);
    }
}

function deleteReference(key) {
    delete referenceData[key];
    localStorage.setItem('referenceData', JSON.stringify(referenceData));
    populateReferenceTable();
}

function deleteAllReferences() {
    referenceData = {};
    localStorage.removeItem('referenceData');
    populateReferenceTable();
}

// Function to toggle the menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchReferenceData();
};
