let monitoringData = [];
let currentPage = 1; // Aktuelle Seite
const recordsPerPage = 20; // Anzahl der Datensätze pro Seite

function fetchMonitoringData() {
    const savedData = localStorage.getItem('monitoringData');
    if (savedData) {
        monitoringData = JSON.parse(savedData);
        sortMonitoringData();
        renderResultsTable();
    }
}

function sortMonitoringData() {
    monitoringData.sort((a, b) => {
        const totalA = a.scores.reduce((sum, score) => sum + score, 0) - Math.max(...a.scores) - Math.min(...a.scores);
        const totalB = b.scores.reduce((sum, score) => sum + score, 0) - Math.max(...b.scores) - Math.min(...b.scores);
        return totalB - totalA;
    });
}

function renderResultsTable() {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, monitoringData.length);

    monitoringData.slice(startIndex, endIndex).forEach((entry, index) => {
        const row = document.createElement('tr');
        const total = entry.scores.reduce((sum, score) => sum + score, 0);
        const points = total - Math.max(...entry.scores) - Math.min(...entry.scores);
        const minScore = Math.min(...entry.scores);
        const maxScore = Math.max(...entry.scores);

        let placeClass = '';
        if (startIndex + index === 0) placeClass = 'gold';
        else if (startIndex + index === 1) placeClass = 'silver';
        else if (startIndex + index === 2) placeClass = 'bronze';

        row.innerHTML = `
            <td class="${placeClass}">${startIndex + index + 1}</td>
            <td>${points}</td>
            <td>${total}</td>
            ${entry.scores.map((score, i) => `<td class="${score === minScore || score === maxScore ? 'streicher' : ''}">WR${i + 1}: ${score}</td>`).join('')}
            <td>${entry.startNumber}</td>
            <td>${entry.club}</td>
            <td>${entry.starterName}</td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = Math.ceil(monitoringData.length / recordsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(monitoringData.length / recordsPerPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderResultsTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(monitoringData.length / recordsPerPage)) {
        currentPage++;
        renderResultsTable();
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchMonitoringData();
};
