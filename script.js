let entries = [];
let startersData = {}; // Object to store starters data

// Function to fetch starters data from another page or API
async function fetchStartersData() {
    // Simulate fetching data from an external source
    startersData = {
        "1": { ageGroup: "U14", discipline: "Lauf", club: "Verein A", name: "Starter A" },
        "2": { ageGroup: "U16", discipline: "Sprung", club: "Verein B", name: "Starter B" },
        "3": { ageGroup: "U18", discipline: "Wurf", club: "Verein C", name: "Starter C" }
        // Add more data as needed
    };

    // Populate start numbers, age groups, and disciplines in the dropdowns
    const startNumberSelect = document.getElementById('startNumber');
    const ageGroupSelect = document.getElementById('ageGroup');
    const disciplineSelect = document.getElementById('discipline');
    
    const ageGroups = new Set();
    const disciplines = new Set();

    for (const startNumber in startersData) {
        const option = document.createElement('option');
        option.value = startNumber;
        option.text = startNumber;
        startNumberSelect.appendChild(option);

        ageGroups.add(startersData[startNumber].ageGroup);
        disciplines.add(startersData[startNumber].discipline);
    }

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
}

function updateStarterInfo() {
    const startNumber = document.getElementById('startNumber').value;
    const starterInfo = startersData[startNumber] || { ageGroup: "", discipline: "", club: "", name: "" };

    document.getElementById('ageGroup').value = starterInfo.ageGroup;
    document.getElementById('discipline').value = starterInfo.discipline;
    document.getElementById('club').value = starterInfo.club;
    document.getElementById('starterName').value = starterInfo.name;
}

function saveEntry() {
    const form = document.getElementById('entryForm');
    const formData = new FormData(form);
    const startNumber = formData.get('startNumber');
    const starterInfo = startersData[startNumber] || { club: "", name: "" };

    const entry = {
        tournament: formData.get('tournament'),
        ageGroup: formData.get('ageGroup'),
        discipline: formData.get('discipline'),
        startNumber: startNumber,
        club: starterInfo.club,
        starterName: starterInfo.name,
        scores: []
    };

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
    updateResultsTable();

    // Retain tournament, ageGroup, and discipline; increment startNumber
    const nextStartNumber = parseInt(startNumber) + 1;
    if (startersData[nextStartNumber]) {
        document.getElementById('startNumber').value = nextStartNumber;
        updateStarterInfo();
    }
}

function updateResultsTable() {
    const filterTournament = document.getElementById('filterTournament').value;
    const filterAgeGroup = document.getElementById('filterAgeGroup').value;
    const filterDiscipline = document.getElementById('filterDiscipline').value;

    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const filteredEntries = entries.filter(entry => {
        return (!filterTournament || entry.tournament === filterTournament) &&
               (!filterAgeGroup || entry.ageGroup.includes(filterAgeGroup)) &&
               (!filterDiscipline || entry.discipline.includes(filterDiscipline));
    });

    filteredEntries.sort((a, b) => b.pointScore - a.pointScore);

    filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.tournament}</td>
            <td>${entry.ageGroup}</td>
            <td>${entry.discipline}</td>
            <td>${entry.startNumber}</td>
            <td>${entry.club}</td>
            <td>${entry.starterName}</td>
            <td>${entry.scores.join(', ')}</td>
            <td>${entry.lowestScore}, ${entry.highestScore}</td>
            <td>${entry.pointScore}</td>
            <td>${entry.totalScore}</td>
        `;

        tableBody.appendChild(row);
    });
}

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

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Fetch starters data on page load
window.onload = fetchStartersData;
