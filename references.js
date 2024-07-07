let referenceData = {};

// Function to update the reference table
function updateReferenceTable() {
    const tableBody = document.querySelector('#referenceTable tbody');
    tableBody.innerHTML = '';

    // Convert referenceData to an array and sort
    const sortedData = Object.values(referenceData).sort((a, b) => {
        // Sort by date, then ageGroup, then discipline, then startNumber
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        if (a.ageGroup < b.ageGroup) return -1;
        if (a.ageGroup > b.ageGroup) return 1;

        if (a.discipline < b.discipline) return -1;
        if (a.discipline > b.discipline) return 1;

        return a.startNumber - b.startNumber;
    });

    sortedData.forEach(ref => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${ref.tournament}</td>
            <td>${ref.date}</td>
            <td>${ref.ageGroup}</td>
            <td>${ref.discipline}</td>
            <td>${ref.startNumber}</td>
            <td>${ref.club}</td>
            <td>${ref.starterName}</td>
            <td><button class="delete-button" onclick="deleteReference('${ref.startNumber}')">löschen</button></td>
        `;

        tableBody.appendChild(row);
    });
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

            worksheet.slice(1).forEach((row, index) => { // slice(1) to skip header row
                if (row.length < 7 || row.includes("")) {
                    return; // Skip rows with missing data
                }
                referenceData[row[4]] = {
                    tournament: row[0],
                    date: formatDate(row[1]),
                    ageGroup: row[2],
                    discipline: row[3],
                    startNumber: row[4],
                    club: row[5],
                    starterName: row[6]
                };
                progressBar.value = ((index + 1) / (worksheet.length - 1)) * 100; // Update progress bar
            });

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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Load data from localStorage on page load
window.onload = loadFromLocalStorage;
window.onbeforeunload = saveToLocalStorage;
