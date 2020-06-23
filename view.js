'use strict';

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
      +         getRacesListHTML(dailyRaces.races).join('\n')
      + '   </ul>\n'
      + '</li>\n';
  }).join('\n');
  previousRaces.innerHTML = dailyRacesHTML;
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



function writeRacerPlace(position) {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return position;
  }
}

function getDescription(race) {
  const dayMonthYear = getDayMonthYear(race.datetime, 'short');
  const hourMinute = getHourMinute(race.datetime);
  return `🕑 ${hourMinute} 🗓 ${dayMonthYear}<br />\n`
    + 'Kartódromo do seu Zé (Belo Horizonte)<br />\n'
    + race.description;
}

function getRacesDates(races) {
  return races
    .map(race => getDayMonthYear(race.datetime, 'long'))
    .sort()                                            // TODO: VERIFICAR
    .reduce(removeRepeated, [])
    .reverse();                                        // TODO: VERIFICAR
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

function renderSpinner(elementToRenderSpinner) {
  const spinnerHTML = '<div class="sk-fading-circle">\n'
    + '  <div class="sk-circle1 sk-circle"></div>\n'
    + '  <div class="sk-circle2 sk-circle"></div>\n'
    + '  <div class="sk-circle3 sk-circle"></div>\n'
    + '  <div class="sk-circle4 sk-circle"></div>\n'
    + '  <div class="sk-circle5 sk-circle"></div>\n'
    + '  <div class="sk-circle6 sk-circle"></div>\n'
    + '  <div class="sk-circle7 sk-circle"></div>\n'
    + '  <div class="sk-circle8 sk-circle"></div>\n'
    + '  <div class="sk-circle9 sk-circle"></div>\n'
    + '  <div class="sk-circle10 sk-circle"></div>\n'
    + '  <div class="sk-circle11 sk-circle"></div>\n'
    + '  <div class="sk-circle12 sk-circle"></div>\n'
    + '</div>';
  elementToRenderSpinner.innerHTML = spinnerHTML;
}

