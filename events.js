'use strict';

function onInstallClick(event) {
  hideInstallButton();
  deferredPrompt.prompt();
}

function onClickViewResults(event) {
  const listItemId = event.path[1].id;
  const race = racesFromFirebase.find(
    currentRace => generateRaceId(currentRace) === listItemId
  );
  renderRaceModal(race);
}

