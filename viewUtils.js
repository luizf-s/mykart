'use strict';

function showInstallButton() {
  document.querySelector('#install-button').hidden = false;
}

function hideInstallButton() {
  document.querySelector('#install-button').hidden = true;
}

function showModal() {
  document.querySelector('div.modal').style.display = 'initial';
}

function hideModal() {
  document.querySelector('div.modal').style.display = 'none';
}
