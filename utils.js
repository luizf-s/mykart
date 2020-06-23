'use strict';

// TODO: verificar tipo recebido para definir melhor local de fazer
// .toDate()
function getHourMinute(date) {
  return date.toDate().toLocaleString('pt-br', {
    hour: 'numeric',
    minute: 'numeric',
  });
}

function getDayMonthYear(date, monthType='long') {
  return date.toDate().toLocaleString('pt-br', {
    day: '2-digit',
    month: monthType,
    year: 'numeric',
  });
}

// TODO: rename, rewrite with renderPreviousRaces racesList
function getRacesOfDay(date, races) {
  return races.filter(race => getDayMonthYear(race.datetime, 'long') === date);
}


function generateRaceId(race) {
  return `${race.description} - ${race.datetime.toDate().toString()}`;
}


function removeRepeated (accumulator, currentValue, currentIndex, sourceArray) {
  if (currentValue != sourceArray[currentIndex + 1])
    return [...accumulator, currentValue]
  return accumulator;
}
