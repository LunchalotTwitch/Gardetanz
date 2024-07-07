let monitoringData = [];

function fetchMonitoringData() {
    const savedData = localStorage.getItem('monitoringData');
    if (savedData) {
        monitoringData = JSON.parse(savedData);
        renderResultsTable();
    }
}

function renderResultsTable() {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    monitoringData.forEach((entry, index) => {
        const row = document.createElement('tr');

        const total = entry.scores.reduce((sum, score) => sum + score, 0);
        const points = total - Math.max(...entry.scores) - Math.min(...entry.scores);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${points}</td>
            <td>${total}</td>
            <td>${Math.min(...entry.scores)}, ${Math.max(...entry.scores)}</td>
            <td>${entry.startNumber}</td>
            <td>${entry.club}</td>
            <td>${entry.starterName}</td>
            <td>${entry.scores.join(', ')}</td>
        `;

        tableBody.appendChild(row);
    });
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchMonitoringData();
};
