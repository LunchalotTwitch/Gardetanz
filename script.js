let monitoringData = [];
let importData = [];

// Fetch import data and populate tournaments on page load
function fetchImportData() {
    const savedImportData = localStorage.getItem('importData');
    if (savedImportData) {
        importData = JSON.parse(savedImportData);
        populateTournaments();
    }
}

function populateTournaments() {
    const tournaments = [...new Set(importData.map(item => item.Turnier))];
    const tournamentSelect = document.getElementById('tournament');
    tournamentSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentSelect.appendChild(option);
    });
}

function updateAgeGroups() {
    const tournament = document.getElementById('tournament').value;
    const ageGroups = [...new Set(importData.filter(item => item.Turnier === tournament).map(item => item.Altersklasse))];
    const ageGroupSelect = document.getElementById('ageGroup');
    ageGroupSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    ageGroups.forEach(ageGroup => {
        const option = document.createElement('option');
        option.value = ageGroup;
        option.textContent = ageGroup;
        ageGroupSelect.appendChild(option);
    });
    ageGroupSelect.disabled = ageGroups.length === 0;
    document.getElementById('ageGroup').disabled = false; // Enable the age group select
}

function updateDisciplines() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const disciplines = [...new Set(importData.filter(item => item.Turnier === tournament && item.Altersklasse === ageGroup).map(item => item.Disziplin))];
    const disciplineSelect = document.getElementById('discipline');
    disciplineSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    disciplines.forEach(discipline => {
        const option = document.createElement('option');
        option.value = discipline;
        option.textContent = discipline;
        disciplineSelect.appendChild(option);
    });
    disciplineSelect.disabled = disciplines.length === 0;
    document.getElementById('discipline').disabled = false; // Enable the discipline select
}

function updateStartNumbers() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumbers = [...new Set(importData.filter(item => item.Turnier === tournament && item.Altersklasse === ageGroup && item.Disziplin === discipline).map(item => item.Startnr))];
    const startNumberSelect = document.getElementById('startNumber');
    startNumberSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    startNumbers.forEach(startNumber => {
        const option = document.createElement('option');
        option.value = startNumber;
        option.textContent = startNumber;
        startNumberSelect.appendChild(option);
    });
    startNumberSelect.disabled = startNumbers.length === 0;
    document.getElementById('startNumber').disabled = false; // Enable the start number select
}

function updateStarterInfo() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumber = document.getElementById('startNumber').value;
    const starterInfo = importData.find(item => item.Turnier === tournament && item.Altersklasse === ageGroup && item.Disziplin === discipline && item.Startnr === startNumber);

    if (starterInfo) {
        document.getElementById('club').value = starterInfo.Verein;
        document.getElementById('starterName').value = starterInfo.Name;

    }
}

function nextInput(event) {
    if (event.key === 'Enter') {
        const formElements = [...document.forms[0].elements];
        const index = formElements.indexOf(event.target);
        if (index > -1 && index < formElements.length - 1) {
            formElements[index + 1].focus();
        }
        event.preventDefault();
    }
}

function saveEntry() {
    const scores = Array.from(document.querySelectorAll('input[name="score"]')).map(input => parseInt(input.value));
    const entry = {
        tournament: document.getElementById('tournament').value,
        ageGroup: document.getElementById('ageGroup').value,
        discipline: document.getElementById('discipline').value,
        startNumber: document.getElementById('startNumber').value,
        club: document.getElementById('club').value,
        starterName: document.getElementById('starterName').value,
        scores: scores
    };

    monitoringData.push(entry);
    localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
    alert('Eintrag gespeichert!');
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.onload = () => {
    fetchImportData();
};
