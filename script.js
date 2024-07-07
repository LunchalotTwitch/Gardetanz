let referenceData = {}; // Object to store reference data
let entries = []; // Array to store entries

// Function to fetch reference data from localStorage
function fetchReferenceData() {
    const savedData = localStorage.getItem('referenceData');
    if (savedData) {
        referenceData = JSON.parse(savedData);

        // Populate tournaments
        const tournamentSelect = document.getElementById('tournament');
        const tournaments = new Set();
        for (const startNumber in referenceData) {
            tournaments.add(referenceData[startNumber].tournament);
        }

        tournaments.forEach(tournament => {
            const option = document.createElement('option');
            option.value = tournament;
            option.text = tournament;
            tournamentSelect.appendChild(option);
        });
    }
}

// Function to fetch entries from localStorage
function fetchEntries() {
    const savedEntries = localStorage.getItem('entries');
    if (savedEntries) {
        entries = JSON.parse(savedEntries);
    }
}

// Function to update age groups based on selected tournament
function updateAgeGroups() {
    const tournament = document.getElementById('tournament').value;
    const ageGroupSelect = document.getElementById('ageGroup');
    ageGroupSelect.innerHTML = '<option value="">Wählen...</option>';

    if (tournament) {
        const ageGroups = new Set();
        for (const startNumber in referenceData) {
            if (referenceData[startNumber].tournament === tournament) {
                ageGroups.add(referenceData[startNumber].ageGroup);
            }
        }

        ageGroups.forEach(ageGroup => {
            const option = document.createElement('option');
            option.value = ageGroup;
            option.text = ageGroup;
            ageGroupSelect.appendChild(option);
        });

        ageGroupSelect.disabled = false;
    } else {
        ageGroupSelect.disabled = true;
        document.getElementById('discipline').disabled = true;
        document.getElementById('startNumber').disabled = true;
        document.getElementById('club').value = '';
        document.getElementById('starterName').value = '';
    }
}

// Function to update disciplines based on selected age group
function updateDisciplines() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const disciplineSelect = document.getElementById('discipline');
    disciplineSelect.innerHTML = '<option value="">Wählen...</option>';

    if (tournament && ageGroup) {
        const disciplines = new Set();
        for (const startNumber in referenceData) {
            if (referenceData[startNumber].tournament === tournament && referenceData[startNumber].ageGroup === ageGroup) {
                disciplines.add(referenceData[startNumber].discipline);
            }
        }

        disciplines.forEach(discipline => {
            const option = document.createElement('option');
            option.value = discipline;
            option.text = discipline;
            disciplineSelect.appendChild(option);
        });

        disciplineSelect.disabled = false;
    } else {
        disciplineSelect.disabled = true;
        document.getElementById('startNumber').disabled = true;
        document.getElementById('club').value = '';
        document.getElementById('starterName').value = '';
    }
}

// Function to update start numbers based on selected discipline
function updateStartNumbers() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumberSelect = document.getElementById('startNumber');
    startNumberSelect.innerHTML = '<option value="">Wählen...</option>';

    if (tournament && ageGroup && discipline) {
        for (const startNumber in referenceData) {
            if (referenceData[startNumber].tournament === tournament &&
                referenceData[startNumber].ageGroup === ageGroup &&
                referenceData[startNumber].discipline === discipline) {
                const option = document.createElement('option');
                option.value = startNumber;
                option.text = startNumber;
                startNumberSelect.appendChild(option);
            }
        }

        startNumberSelect.disabled = false;
    } else {
        startNumberSelect.disabled = true;
        document.getElementById('club').value = '';
        document.getElementById('starterName').value = '';
    }
}

// Function to update starter info based on selected start number
function updateStarterInfo() {
    const startNumber = document.getElementById('startNumber').value;
    if (startNumber) {
        const starterInfo = referenceData[startNumber];
        document.getElementById('club').value = starterInfo.club;
        document.getElementById('starterName').value = starterInfo.starterName;
    } else {
        document.getElementById('club').value = '';
        document.getElementById('starterName').value = '';
    }
}

// Function to check if entry already exists
function entryExists(entry) {
    return entries.some(existingEntry => 
        existingEntry.tournament === entry.tournament &&
        existingEntry.ageGroup === entry.ageGroup &&
        existingEntry.discipline === entry.discipline &&
        existingEntry.startNumber === entry.startNumber
    );
}

// Function to save entry
function saveEntry() {
    const form = document.getElementById('entryForm');
    const formData = new FormData(form);
    const startNumber = formData.get('startNumber');
    const starterInfo = referenceData[startNumber] || { club: "", starterName: "" };

    const entry = {
        tournament: formData.get('tournament'),
        ageGroup: formData.get('ageGroup'),
        discipline: formData.get('discipline'),
        startNumber: startNumber,
        club: starterInfo.club,
        starterName: starterInfo.starterName,
        scores: []
    };

    if (entryExists(entry)) {
        alert("Dieser Eintrag wurde bereits hinzugefügt.");
        return;
    }

    formData.getAll('score').forEach(score => {
        if (score) {
            entry.scores.push(parseInt(score));
        }
    });

    const sortedScores = [...entry.scores].sort((a, b) => a - b);
    entry.lowestScore = sortedScores[0];
    entry.highestScore = sortedScores[sortedScores.length - 1];
    entry.pointScore = entry.scores.reduce((a, b) => a + b, 0) - entry.lowestScore - entry.highestScore;
    entry.totalScore = entry.scores.reduce((a, b) => a + b, 0);

    entries.push(entry);
    saveEntriesToLocalStorage();
    updateResultsTable();

    // Retain tournament, ageGroup, and discipline; increment startNumber
    const nextStartNumber = parseInt(startNumber) + 1;
    if (referenceData[nextStartNumber]) {
        document.getElementById('startNumber').value = nextStartNumber;
        updateStarterInfo();
    }
}

// Function to save entries to localStorage
function saveEntriesToLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Function to update the results table
function updateResultsTable() {
    const filterTournament = document.getElementById('tournament').value;
    const filterAgeGroup = document.getElementById('ageGroup').value;
    const filterDiscipline = document.getElementById('discipline').value;

    const resultsTitle = document.getElementById('resultsTitle');
    const resultsTable = document.getElementById('resultsTable');

    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const filteredEntries = entries.filter(entry => {
        return (!filterTournament || entry.tournament === filterTournament) &&
               (!filterAgeGroup || entry.ageGroup === filterAgeGroup) &&
               (!filterDiscipline || entry.discipline === filterDiscipline);
    });

    if (filterTournament && filterAgeGroup && filterDiscipline) {
        resultsTitle.style.display = 'block';
        resultsTable.style.display = 'table';
    } else {
        resultsTitle.style.display = 'none';
        resultsTable.style.display = 'none';
    }

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
            <td>${entry.pointScore}</td>
            <td>${entry.totalScore}</td>
            <td>${entry.lowestScore}, ${entry.highestScore}</td>
            ${scoresHtml}
            <td>${entry.startNumber}</td>
            <td>${entry.club}</td>
            <td>${entry.starterName}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to handle Enter key for moving to the next input field
function nextInput(event) {
    if (event.key === "Enter") {
        const formElements = Array.from(event.target.form.elements);
        const index = formElements.indexOf(event.target);
        if (index > -1 && index < formElements.length - 1) {
            formElements[index + 1].focus();
        }
        event.preventDefault();
    }
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
    updateResultsTable();
};
