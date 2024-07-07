let entries = []; // Array to store entries

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
        tournaments.add(entry.tournament);
        ageGroups.add(entry.ageGroup);
        disciplines.add(entry.discipline);
        clubs.add(entry.club);
        dates.add(entry.date);
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
        return (!filterDate || entry.date === filterDate) &&
               (!filterTournament || entry.tournament === filterTournament) &&
               (!filterAgeGroup || entry.ageGroup === filterAgeGroup) &&
               (!filterDiscipline || entry.discipline === filterDiscipline) &&
               (!filterClub || entry.club === filterClub);
    });

    filteredEntries.sort((a, b) => b.pointScore - a.pointScore);

    filteredEntries.forEach((entry, index) => {
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
            <td>${entry.date}</td>
            <td>${entry.tournament}</td>
            <td>${entry.ageGroup}</td>
            <td>${entry.discipline}</td>
            <td>${entry.startNumber}</td>
            <td>${entry.club}</td>
            <td>${entry.starterName}</td>
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

// Fetch entries and populate filters on page load
window.onload = () => {
    fetchEntries();
    populateFilters();
    updateResultsTable();
};
