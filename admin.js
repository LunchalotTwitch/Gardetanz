let monitoringData = [];
let filteredData = [];
let currentPage = 1; // Aktuelle Seite
const recordsPerPage = 20; // Anzahl der Datensätze pro Seite

function fetchMonitoringData() {
    const savedData = localStorage.getItem('monitoringData');
    if (savedData) {
        monitoringData = JSON.parse(savedData);
        populateFilters();
        applyFilters();
    }
}

function populateFilters() {
    const tournaments = [...new Set(monitoringData.map(item => item.tournament))];
    const ageGroups = [...new Set(monitoringData.map(item => item.ageGroup))];
    const disciplines = [...new Set(monitoringData.map(item => item.discipline))];
    const clubs = [...new Set(monitoringData.map(item => item.club))];
    const names = [...new Set(monitoringData.map(item => item.starterName))];

    const tournamentSelect = document.getElementById('filterTournament');
    const ageGroupSelect = document.getElementById('filterAgeGroup');
    const disciplineSelect = document.getElementById('filterDiscipline');
    const clubSelect = document.getElementById('filterClub');
    const nameSelect = document.getElementById('filterName');

    tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentSelect.appendChild(option);
    });

    ageGroups.forEach(ageGroup => {
        const option = document.createElement('option');
        option.value = ageGroup;
        option.textContent = ageGroup;
        ageGroupSelect.appendChild(option);
    });

    disciplines.forEach(discipline => {
        const option = document.createElement('option');
        option.value = discipline;
        option.textContent = discipline;
        disciplineSelect.appendChild(option);
    });

    clubs.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.textContent = club;
        clubSelect.appendChild(option);
    });

    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });
}

function applyFilters() {
    const tournament = document.getElementById('filterTournament').value;
    const ageGroup = document.getElementById('filterAgeGroup').value;
    const discipline = document.getElementById('filterDiscipline').value;
    const club = document.getElementById('filterClub').value;
    const name = document.getElementById('filterName').value;

    let data = monitoringData;

    if (tournament) {
        data = data.filter(item => item.tournament === tournament);
    }
    if (ageGroup) {
        data = data.filter(item => item.ageGroup === ageGroup);
    }
    if (discipline) {
        data = data.filter(item => item.discipline === discipline);
    }
    if (club) {
        data = data.filter(item => item.club === club);
    }
    if (name) {
        data = data.filter(item => item.starterName === name);
    }

    filteredData = data;
    renderAdminTable();
}

function renderAdminTable() {
    const tableBody = document.querySelector('#adminTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, filteredData.length);

    filteredData.slice(startIndex, endIndex).forEach((entry, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" value="${entry.tournament}" id="tournament-${startIndex + index}"></td>
            <td><input type="text" value="${entry.ageGroup}" id="ageGroup-${startIndex + index}"></td>
            <td><input type="text" value="${entry.discipline}" id="discipline-${startIndex + index}"></td>
            <td><input type="text" value="${entry.startNumber}" id="startNumber-${startIndex + index}"></td>
            <td><input type="text" value="${entry.club}" id="club-${startIndex + index}"></td>
            <td><input type="text" value="${entry.starterName}" id="starterName-${startIndex + index}"></td>
            ${entry.scores.map((score, i) => `<td><input type="number" value="${score}" id="score-${startIndex + index}-${i}" min="10" max="100" step="10"></td>`).join('')}
            <td>
                <button onclick="saveEntry(${startIndex + index})">Speichern</button>
                <button onclick="deleteEntry(${startIndex + index})" class="red-button">Löschen</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = Math.ceil(filteredData.length / recordsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(filteredData.length / recordsPerPage);
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

function deleteEntry(index) {
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
        monitoringData.splice(index, 1);
        localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
        applyFilters();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderAdminTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
        currentPage++;
        renderAdminTable();
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchMonitoringData();
};
