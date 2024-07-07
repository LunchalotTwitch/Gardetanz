let monitoringData = [];

function fetchMonitoringData() {
    const savedData = localStorage.getItem('monitoringData');
    if (savedData) {
        monitoringData = JSON.parse(savedData);
        renderAdminTable();
    }
}

function renderAdminTable() {
    const tableBody = document.querySelector('#adminTable tbody');
    tableBody.innerHTML = '';

    monitoringData.forEach((entry, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" value="${entry.tournament}" id="tournament-${index}"></td>
            <td><input type="text" value="${entry.ageGroup}" id="ageGroup-${index}"></td>
            <td><input type="text" value="${entry.discipline}" id="discipline-${index}"></td>
            <td><input type="text" value="${entry.startNumber}" id="startNumber-${index}"></td>
            <td><input type="text" value="${entry.club}" id="club-${index}"></td>
            <td><input type="text" value="${entry.starterName}" id="starterName-${index}"></td>
            ${entry.scores.map((score, i) => `<td><input type="number" value="${score}" id="score-${index}-${i}" min="10" max="100" step="10"></td>`).join('')}
            <td><button onclick="saveEntry(${index})">Speichern</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function saveEntry(index) {
    const entry = {
        tournament: document.getElementById(`tournament-${index}`).value,
        ageGroup: document.getElementById(`ageGroup-${index}`).value,
        discipline: document.getElementById(`discipline-${index}`).value,
        startNumber: document.getElementById(`startNumber-${index}`).value,
        club: document.getElementById(`club-${index}`).value,
        starterName: document.getElementById(`starterName-${index}`).value,
        scores: Array.from({ length: 7 }, (_, i) => parseInt(document.getElementById(`score-${index}-${i}`).value))
    };

    monitoringData[index] = entry;
    localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
    alert('Eintrag gespeichert!');
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchMonitoringData();
};
