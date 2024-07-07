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

    const tournamentSelect = document.getElementById('filterTournament');
    const ageGroupSelect = document.getElementById('filterAgeGroup');
    const disciplineSelect = document.getElementById('filterDiscipline');
    const clubSelect = document.getElementById('filterClub');

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
}

function applyFilters() {
    const tournament = document.getElementById('filterTournament').value;
    const ageGroup = document.getElementById('filterAgeGroup').value;
    const discipline = document.getElementById('filterDiscipline').value;
    const club = document.getElementById('filterClub').value;

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

    filteredData = data;
    populateNames();
    sortFilteredData();
    renderResultsTable();
}

function populateNames() {
    const club = document.getElementById('filterClub').value;
    const nameSelect = document.getElementById('filterName');
    nameSelect.innerHTML = '<option value="">Alle</option>'; // Reset names
    nameSelect.disabled = !club; // Disable if no club is selected

    if (club) {
        const names = [...new Set(filteredData.map(item => item.starterName))];
        names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            nameSelect.appendChild(option);
        });
    }
}

function sortFilteredData() {
    filteredData.sort((a, b) => {
        const totalA = calculatePoints(a.scores);
        const totalB = calculatePoints(b.scores);
        return totalB - totalA;
    });
}

function calculatePoints(scores) {
    const sortedScores = [...scores].sort((a, b) => a - b);
    const uniqueScores = [...new Set(sortedScores)];
    const minScore = uniqueScores.shift();
    const maxScore = uniqueScores.pop();
    const remainingScores = scores.filter(score => score !== minScore && score !== maxScore);
    return remainingScores.reduce((sum, score) => sum + score, 0);
}

function renderResultsTable() {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, filteredData.length);

    filteredData.slice(startIndex, endIndex).forEach((entry, index) => {
        const row = document.createElement('tr');
        const allScoresZero = entry.scores.every(score => score === 0);
        const rowClass = allScoresZero ? 'strikethrough' : '';
        const total = entry.scores.reduce((sum, score) => sum + score, 0);
        const points = calculatePoints(entry.scores);
        const sortedScores = [...entry.scores].sort((a, b) => a - b);
        const uniqueScores = [...new Set(sortedScores)];
        const minScore = uniqueScores.shift();
        const maxScore = uniqueScores.pop();

        let placeClass = '';
        if (startIndex + index === 0) placeClass = 'gold';
        else if (startIndex + index === 1) placeClass = 'silver';
        else if (startIndex + index === 2) placeClass = 'bronze';

        row.innerHTML = `
            <td class="${placeClass} ${rowClass}">${startIndex + index + 1}</td>
            <td class="${rowClass}">${points}</td>
            <td class="${rowClass}">${total}</td>
            ${entry.scores.map(score => `<td class="${(score === minScore || score === maxScore) ? 'streicher' : ''} ${rowClass}">${score}</td>`).join('')}
            <td class="${rowClass}">${entry.startNumber}</td>
            <td class="${rowClass}">${entry.club}</td>
            <td class="${rowClass}">${entry.starterName}</td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = Math.ceil(filteredData.length / recordsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(filteredData.length / recordsPerPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderResultsTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
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
