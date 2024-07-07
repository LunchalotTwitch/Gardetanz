let monitoringData = [];
let referenceData = [];

function fetchReferenceData() {
    const savedReferenceData = localStorage.getItem('referenceData');
    if (savedReferenceData) {
        referenceData = JSON.parse(savedReferenceData);
        populateTournaments();
    }
}

function populateTournaments() {
    const tournaments = [...new Set(referenceData.map(item => item.tournament))];
    const tournamentSelect = document.getElementById('tournament');
    tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentSelect.appendChild(option);
    });
}

function updateAgeGroups() {
    const tournament = document.getElementById('tournament').value;
    const ageGroups = [...new Set(referenceData.filter(item => item.tournament === tournament).map(item => item.ageGroup))];
    const ageGroupSelect = document.getElementById('ageGroup');
    ageGroupSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    ageGroups.forEach(ageGroup => {
        const option = document.createElement('option');
        option.value = ageGroup;
        option.textContent = ageGroup;
        ageGroupSelect.appendChild(option);
    });
    ageGroupSelect.disabled = false;
}

function updateDisciplines() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const disciplines = [...new Set(referenceData.filter(item => item.tournament === tournament && item.ageGroup === ageGroup).map(item => item.discipline))];
    const disciplineSelect = document.getElementById('discipline');
    disciplineSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    disciplines.forEach(discipline => {
        const option = document.createElement('option');
        option.value = discipline;
        option.textContent = discipline;
        disciplineSelect.appendChild(option);
    });
    disciplineSelect.disabled = false;
}

function updateStartNumbers() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumbers = [...new Set(referenceData.filter(item => item.tournament === tournament && item.ageGroup === ageGroup && item.discipline === discipline).map(item => item.startNumber))];
    const startNumberSelect = document.getElementById('startNumber');
    startNumberSelect.innerHTML = '<option value="">Wählen...</option>'; // Reset options
    startNumbers.forEach(startNumber => {
        const option = document.createElement('option');
        option.value = startNumber;
        option.textContent = startNumber;
        startNumberSelect.appendChild(option);
    });
    startNumberSelect.disabled = false;
}

function updateStarterInfo() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumber = document.getElementById('startNumber').value;
    const starterInfo = referenceData.find(item => item.tournament === tournament && item.ageGroup === ageGroup && item.discipline === discipline && item.startNumber === startNumber);

    if (starterInfo) {
        document.getElementById('club').value = starterInfo.club;
        document.getElementById('starterName').value = starterInfo.starterName;
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
    fetchReferenceData();
};
