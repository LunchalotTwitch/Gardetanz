let importData = []; // Array to store imported data
let currentPage = 1; // Current page
const recordsPerPage = 20; // Records per page

function fetchImportData() {
    const savedData = localStorage.getItem('importData');
    if (savedData) {
        importData = JSON.parse(savedData);
        sortData();
        renderTable();
    }
}

function sortData() {
    const ageGroupOrder = { 'Jugend': 1, 'Junioren': 2, 'Senioren': 3 };
    importData.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        if (dateA - dateB !== 0) return dateA - dateB;
        if (ageGroupOrder[a.ageGroup] - ageGroupOrder[b.ageGroup] !== 0) return ageGroupOrder[a.ageGroup] - ageGroupOrder[b.ageGroup];
        if (a.discipline.localeCompare(b.discipline) !== 0) return a.discipline.localeCompare(b.discipline);
        return parseInt(a.startNumber) - parseInt(b.startNumber);
    });
}

function renderTable() {
    const tableBody = document.querySelector('#importTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, importData.length);

    for (let i = startIndex; i < endIndex; i++) {
        const data = importData[i];
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${data.date}</td>
            <td>${data.ageGroup}</td>
            <td>${data.discipline}</td>
            <td>${data.startNumber}</td>
            <td>${data.tournament}</td>
            <td>${data.club}</td>
            <td>${data.starterName || ''}</td>
        `;

        tableBody.appendChild(row);
    }

    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = Math.ceil(importData.length / recordsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(importData.length / recordsPerPage);
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

            importData = []; // Reset import data
            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                if (row.length >= 7 && importData.length < 500) { // Ensure all required columns are present and limit to 500 records
                    importData.push({
                        tournament: row[0].toString().trim(),
                        date: row[1].toString().trim(),
                        ageGroup: row[2].toString().trim(),
                        discipline: row[3].toString().trim(),
                        startNumber: row[4].toString().trim(),
                        club: row[5].toString().trim(),
                        starterName: row[6] ? row[6].toString().trim() : '' // Handle optional name field
                    });
                }
            });
            localStorage.setItem('importData', JSON.stringify(importData));
            currentPage = 1; // Reset to first page
            sortData();
            renderTable();
            fileInput.value = ''; // Clear the file input
        };
        reader.readAsArrayBuffer(file);
    }
}

function deleteAllImportData() {
    importData = [];
    localStorage.removeItem('importData');
    currentPage = 1; // Reset to first page
    renderTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(importData.length / recordsPerPage)) {
        currentPage++;
        renderTable();
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchImportData();
};
