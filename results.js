let referenceData = {}; // Object to store reference data
let entries = []; // Array to store entries

// Function to fetch reference data from localStorage
function fetchReferenceData() {
    const savedData = localStorage.getItem('referenceData');
    if (savedData) {
        referenceData = JSON.parse(savedData);
    }
}

// Function to fetch entries from localStorage
function fetchEntries() {
    const savedEntries = localStorage.getItem('entries');
    if (savedEntries) {
        entries = JSON.parse(savedEntries);
    }
}

// Function to populate filter options
function populateFilters() {
    const tournaments = new Set();
    const ageGroups = new Set();
    const disciplines = new Set();
    const clubs = new Set();
    const dates = new Set();

    entries.forEach(entry => {
        const reference = referenceData[entry.startNumber];
        if (reference) {
            tournaments.add(reference.tournament);
            ageGroups.add(reference.ageGroup);
            disciplines.add(reference.discipline);
            clubs.add(reference.club);
            dates.add(reference.date);
        }
    });

    const tournamentSelect = document.getElementById('filterTournament');
    const ageGroupSelect = document.getElementById('filterAgeGroup');
    const disciplineSelect = document.getElementById('filterDiscipline');
    const clubSelect = document.getElementById('filterClub');
    const dateSelect = document.getElementById('filterDate');

    tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.text = tournament;
        tournamentSelect.appendChild(option);
    });

    ageGroups.forEach(ageGroup => {
        const option = document.createElement('option');
        option.value = ageGroup;
        option.text = ageGroup;
        ageGroupSelect.appendChild(option);
    });

    disciplines.forEach(discipline => {
        const option = document.createElement('option');
        option.value = discipline;
        option.text = discipline;
        disciplineSelect.appendChild(option);
    });

    clubs.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.text = club;
        clubSelect.appendChild(option);
    });

    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.text = date;
        dateSelect.appendChild(option);
    });
}

// Function to update the results table based on filters
function updateResultsTable() {
    const filterDate = document.getElementById('filterDate').value;
    const filterTournament = document.getElementById('filterTournament').value;
    const filterAgeGroup = document.getElementById('filterAgeGroup').value;
    const filterDiscipline = document.getElementById('filterDiscipline').value;
    const filterClub = document.getElementById('filterClub').value;

    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const filteredEntries = entries.filter(entry => {
        const reference = referenceData[entry.startNumber];
        if (!reference) return false;

        return (!filterDate || reference.date === filterDate) &&
               (!filterTournament || reference.tournament === filterTournament) &&
               (!filterAgeGroup || reference.ageGroup === filterAgeGroup) &&
               (!filterDiscipline || reference.discipline === filterDiscipline) &&
               (!filterClub || reference.club === filterClub);
    });

    filteredEntries.sort((a, b) => b.pointScore - a.pointScore);

    filteredEntries.forEach((entry, index) => {
        const reference = referenceData[entry.startNumber];
        const row = document.createElement('tr');

        const scoresHtml = entry.scores.map((score, i) => {
            const isLowest = score === entry.lowestScore;
            const isHighest = score === entry.highestScore;
            const className = isLowest || isHighest ? 'highlight' : '';
            return `<td class="${className}">${score}</td>`;
        }).join('');

        let placeClass = '';
        if (index === 0) placeClass = 'gold';
        else if (index === 1) placeClass = 'silver';
        else if (index === 2) placeClass = 'bronze';

        row.innerHTML = `
            <td class="${placeClass}">${index + 1}</td>
            <td>${reference.date}</td>
            <td>${reference.tournament}</td>
            <td>${reference.ageGroup}</td>
            <td>${reference.discipline}</td>
            <td>${entry.startNumber}</td>
            <td>${reference.club}</td>
            <td>${reference.starterName}</td>
            ${scoresHtml}
            <td>${entry.pointScore}</td>
            <td>${entry.totalScore}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to toggle the menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Fetch reference data and entries on page load
window.onload = () => {
    fetchReferenceData();
    fetchEntries();
    populateFilters();
    updateResultsTable();
};
