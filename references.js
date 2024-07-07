let referenceData = {};

// Function to update the reference table
function updateReferenceTable() {
    const tableBody = document.querySelector('#referenceTable tbody');
    tableBody.innerHTML = '';

    for (const startNumber in referenceData) {
        const ref = referenceData[startNumber];
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${startNumber}</td>
            <td>${ref.club}</td>
            <td>${ref.starterName}</td>
            <td><button class="delete-button" onclick="deleteReference('${startNumber}')">löschen</button></td>
        `;

        tableBody.appendChild(row);
    }
}

// Function to delete a specific reference
function deleteReference(startNumber) {
    delete referenceData[startNumber];
    updateReferenceTable();
}

// Function to delete all references
function deleteAllReferences() {
    referenceData = {};
    updateReferenceTable();
    alert("Referenzliste wurde gelöscht.");
}

// Function to save reference data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('referenceData', JSON.stringify(referenceData));
}

// Function to load reference data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('referenceData');
    if (savedData) {
        referenceData = JSON.parse(savedData);
        updateReferenceTable();
    }
}

// Function to toggle the menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Function to import data from Excel
function importFromExcel() {
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            progressBar.style.display = 'block';
            progressBar.value = 0;

            for (let i = 1; i < worksheet.length; i++) {
                const row = worksheet[i];
                if (row.length < 7 || row.includes("")) {
                    continue; // Skip rows with missing data
                }
                referenceData[row[4]] = {
                    tournament: row[0],
                    date: formatDate(row[1]),
                    ageGroup: row[2],
                    discipline: row[3],
                    club: row[5],
                    starterName: row[6]
                };
                progressBar.value = (i / worksheet.length) * 100;
            }

            progressBar.style.display = 'none';
            updateReferenceTable();

            // Clear the file input
            fileInput.value = "";
        };
        reader.readAsArrayBuffer(file);
    }
}

// Function to format date to DD.MM.YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(
