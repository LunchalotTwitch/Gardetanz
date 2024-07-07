let importData = [];
let monitoringData = [];

function fetchImportData() {
    const savedData = localStorage.getItem('importData');
    if (savedData) {
        importData = JSON.parse(savedData);
        populateTournaments();
    }
}

function populateTournaments() {
    const tournamentSelect = document.getElementById('tournament');
    const tournaments = [...new Set(importData.map(item => item.tournament))];
    tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentSelect.appendChild(option);
    });
}

function updateAgeGroups() {
    const tournament = document.getElementById('tournament').value;
    const ageGroupSelect = document.getElementById('ageGroup');
    ageGroupSelect.disabled = !tournament;
    ageGroupSelect.innerHTML = '<option value="">Wählen...</option>';

    if (tournament) {
        const ageGroups = [...new Set(importData.filter(item => item.tournament === tournament).map(item => item.ageGroup))];
        ageGroups.forEach(ageGroup => {
            const option = document.createElement('option');
            option.value = ageGroup;
            option.textContent = ageGroup;
            ageGroupSelect.appendChild(option);
        });
    }
}

function updateDisciplines() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const disciplineSelect = document.getElementById('discipline');
    disciplineSelect.disabled = !ageGroup;
    disciplineSelect.innerHTML = '<option value="">Wählen...</option>';

    if (ageGroup) {
        const disciplines = [...new Set(importData.filter(item => item.tournament === tournament && item.ageGroup === ageGroup).map(item => item.discipline))];
        disciplines.forEach(discipline => {
            const option = document.createElement('option');
            option.value = discipline;
            option.textContent = discipline;
            disciplineSelect.appendChild(option);
        });
    }
}

function updateStartNumbers() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumberSelect = document.getElementById('startNumber');
    startNumberSelect.disabled = !discipline;
    startNumberSelect.innerHTML = '<option value="">Wählen...</option>';

    if (discipline) {
        const startNumbers = importData.filter(item => item.tournament === tournament && item.ageGroup === ageGroup && item.discipline === discipline).map(item => item.startNumber);
        startNumbers.forEach(startNumber => {
            const option = document.createElement('option');
            option.value = startNumber;
            option.textContent = startNumber;
            startNumberSelect.appendChild(option);
        });
    }
}

function updateStarterInfo() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumber = document.getElementById('startNumber').value;

    if (startNumber) {
        const starter = importData.find(item => item.tournament === tournament && item.ageGroup === ageGroup && item.discipline === discipline && item.startNumber === startNumber);
        if (starter) {
            document.getElementById('club').value = starter.club;
            document.getElementById('starterName').value = starter.starterName || '';
        }
    } else {
        document.getElementById('club').value = '';
        document.getElementById('starterName').value = '';
    }
}

function saveEntry() {
    const tournament = document.getElementById('tournament').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const discipline = document.getElementById('discipline').value;
    const startNumber = document.getElementById('startNumber').value;
    const club = document.getElementById('club').value;
    const starterName = document.getElementById('starterName').value;
    const scores = Array.from(document.querySelectorAll('input[name="score"]')).map(input => parseInt(input.value) || 0);

    const entry = {
        tournament,
        ageGroup,
        discipline,
        startNumber,
        club,
        starterName,
        scores
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
    const savedMonitoringData = localStorage.getItem('monitoringData');
    if (savedMonitoringData) {
        monitoringData = JSON.parse(savedMonitoringData);
    }
    fetchImportData();
};
