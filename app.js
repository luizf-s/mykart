'use strict';

let racesFromFirebase = []; // Mutable global variable = 🤮

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  showInstallButton();
});

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

renderSpinner(document.querySelector('main>ul'));
renderSpinner(document.querySelector('main>ul.races-dates'));
fetchRaces(onFetchRaces);
