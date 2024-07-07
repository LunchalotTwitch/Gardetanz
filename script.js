let monitoringData = []; // Array to store monitoring data
let currentPage = 1; // Current page
const recordsPerPage = 20; // Records per page

function fetchMonitoringData() {
    const savedData = localStorage.getItem('importData'); // Load data from importData
    if (savedData) {
        monitoringData = JSON.parse(savedData);
        renderMonitoringTable();
    }
}

function renderMonitoringTable() {
    const tableBody = document.querySelector('#monitoringTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, monitoringData.length);

    for (let i = startIndex; i < endIndex; i++) {
        const data = monitoringData[i];
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
    document.getElementById('totalPages').innerText = Math.ceil(monitoringData.length / recordsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(monitoringData.length / recordsPerPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMonitoringTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(monitoringData.length / recordsPerPage)) {
        currentPage++;
        renderMonitoringTable();
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchMonitoringData();
};
