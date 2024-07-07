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
            const contents = e.target.result;
            const rows = contents.split('\n');
            referenceData = {}; // Reset reference data
            rows.forEach(row => {
                const cols = row.split(',');
                if (cols.length >= 7) { // Ensure all required columns are present
                    const key = cols[4].trim(); // Assuming start number as the key
                    referenceData[key] = {
                        tournament: cols[0].trim(),
                        date: cols[1].trim(),
                        ageGroup: cols[2].trim(),
                        discipline: cols[3].trim(),
                        startNumber: cols[4].trim(),
                        club: cols[5].trim(),
                        starterName: cols[6].trim()
                    };
                }
            });
            localStorage.setItem('referenceData', JSON.stringify(referenceData));
            populateReferenceTable();
            fileInput.value = ''; // Clear the file input
        };
        reader.readAsText(file);
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
