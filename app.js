'use strict';

let racesFromFirebase = []; // Mutable global variable = 🤮

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  showInstallButton();
});

function onInstallClick(event) {
  hideInstallButton();
  deferredPrompt.prompt();
}

function showInstallButton() {
  document.querySelector('#install-button').hidden = false;
}

function hideInstallButton() {
  document.querySelector('#install-button').hidden = true;
}

document.querySelector('#install-button')
  .addEventListener('click', onInstallClick);

window.addEventListener('appinstalled', (event) => {
  console.log('[PWA] app installed successfully');
});

function onFetchRaces(races) {
  saveResultsOnGlobalVariable(races); // 🤮
  renderMainRace(races[0]);
  renderPreviousRaces(races.slice(1));
}

// 🤮
function saveResultsOnGlobalVariable(races) {
  racesFromFirebase = races;
};

function renderMainRace(race) {
  renderRaceDetails(race); 
  renderRacers(race);
}

function renderRaceDetails(race) {
  const description = getDescription(race);
  document.querySelector('p.race-details').innerHTML = description;
}

function renderRacers(race) {
  document.querySelector('main>ul').replaceWith(writeRacersUlElement(race));
}

function writeRacerPlace(position) {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return position;
  }
}

function getDescription(race) {
  console.log(racesFromFirebase);
  const dayMonthYear = getDayMonthYear(race.datetime, 'short');
  const hourMinute = getHourMinute(race.datetime);
  return `🕑 ${hourMinute} 🗓 ${dayMonthYear}<br />\n`
    + 'Kartódromo do seu Zé (Belo Horizonte)<br />\n'
    + race.description;
}

function renderPreviousRaces(races) {
  const dates = getRacesDates(races);
  const racesList = dates.map(date => ({
    date: date,
    races: getRacesOfDay(date, races)
  }));
  const previousRaces = document.querySelector('ul.races-dates');
  // TODO: extract?
  const dailyRacesHTML = racesList.map(dailyRaces => {
    return '<li>\n'
      + `<h3 class="race-date">${dailyRaces.date}</h3>\n`
      + '   <ul class="races-list">\n'
      +         getRacesListHTML(dailyRaces.races).join('\n') // this writes a comma 😢
      + '   </ul>\n'
      + '</li>\n';
  });
  previousRaces.innerHTML = dailyRacesHTML;
}

function getRacesDates(races) {
  return races
    .map(race => getDayMonthYear(race.datetime, 'long'))
    .sort()                                            // TODO: VERIFICAR
    .reduce(removeRepeated, [])
    .reverse();                                        // TODO: VERIFICAR
}

function removeRepeated (accumulator, currentValue, currentIndex, sourceArray) {
  if (currentValue != sourceArray[currentIndex + 1])
    return [...accumulator, currentValue]
  return accumulator;
}

function getRacesListHTML(races) {
  return races.map(race => {
    return `<li id="${generateRaceId(race)}">\n`
      + `   <strong>${getHourMinute(race.datetime)}</strong>\n`
      + `   <p>${race.description}</p>\n`
      + '   <button class="view-results" onclick="onClickViewResults(event)">VER RESULTADOS</button>\n' // WTF?
      + '</li>\n'
  });
}


function getDayMonthYear(date, monthType='long') {
  return date.toDate().toLocaleString('pt-br', {
    day: '2-digit',
    month: monthType,
    year: 'numeric',
  });
}

// TODO: verificar tipo recebido para definir melhor local de fazer
// .toDate()
function getHourMinute(date) {
  return date.toDate().toLocaleString('pt-br', {
    hour: 'numeric',
    minute: 'numeric',
  });
}

// TODO: rename, rewrite with renderPreviousRaces racesList
function getRacesOfDay(date, races) {
  return races.filter(race => getDayMonthYear(race.datetime, 'long') === date);
}


function onClickViewResults(event) {
  const listItemId = event.path[1].id;
  const race = racesFromFirebase.find(
    currentRace => generateRaceId(currentRace) === listItemId
  );
  renderRaceModal(race);
}

function renderRaceModal(race) {
  renderModalBody(race);
  showModal();
}

function renderModalBody(race) {
  const raceContainer = document.createElement('div');
  const raceHTML = '<h2>Última corrida</h2>'
    + `<p class="race-details">${getDescription(race)}</p>`;

  raceContainer.className = 'modal-body';
  raceContainer.innerHTML = raceHTML;
  raceContainer.appendChild(writeRacersUlElement(race));

  document.querySelector('div.modal-body').replaceWith(raceContainer);
}

function writeRacersUlElement(race) {
  const racers = document.createElement('ul');
  const racersStatus = race.raceResult.forEach((racer) => {
    const raceItem = document.createElement('li');
    raceItem.className = 'race-item';
    raceItem.innerHTML =
      `<p class="racer-name">${writeRacerPlace(racer.position)} ${racer.racerName}</p>`
      + `<p>${racer.bestLapTime}</p>`
      + `<p>${racer.differenceFromLeader}</p>`;
    racers.appendChild(raceItem);
  });
  return racers;
}

function showModal() {
  document.querySelector('div.modal').style.display = 'initial';
}

function hideModal() {
  document.querySelector('div.modal').style.display = 'none';
}

function generateRaceId(race) {
  return `${race.description} - ${race.datetime.toDate().toString()}`;
}

fetchRaces(onFetchRaces);
