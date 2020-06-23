'use strict';

const RACES_COLLECTION = 'races';

firebase.initializeApp({
  apiKey: '',
  authDomain: '',
  projectId: '',
});

const db = firebase.firestore();

const allRacesReference = db.collection(RACES_COLLECTION);

function parseFirebaseRaces(races) {
  return races.sort((previousRace, nextRace) =>
    previousRace.datetime.toDate().getTime() > previousRace.datetime.toDate().getTime()
  );
}

function fetchRaces(onFetchRaces) {
  allRacesReference.get().then(querySnapshot => {
    const data = parseFirebaseRaces(querySnapshot.docs.map(race => race.data()));
    onFetchRaces(data.reverse());
  });
}
