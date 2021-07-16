require('dotenv').config();
const {
  menu,
  pause,
  readLine,
  taskListcomplete,
  placesList,
} = require('./helpres/inquirer');
const Search = require('./models/search');

require('colors');

const main = async () => {
  let selectedOption = 0;

  const a = new Search();
  do {
    selectedOption = await menu();

    switch (selectedOption) {
      case 1:
        const place = await readLine(`Please insert a place: `);

        const places = await a.searchPlace(place);

        const idPlace = await placesList(places);
        if (idPlace !== 0) {
          const placeSelected = places.find((m) => m.id === idPlace);
          const weatherPlace = await a.weatherPlace(placeSelected);

          printWeather(placeSelected, weatherPlace);
        }
        break;

      case 2:
        const placeHistoryId = await placesList(a.searchHistory);
        if (placeHistoryId !== 0) {
          const placeHistory = a.searchHistory.find(
            (m) => m.id === placeHistoryId
          );
          const weatherPlac = await a.weatherPlace(placeHistory);
          printWeather(placeHistory, weatherPlac);
        }

        break;
    }

    if (selectedOption !== 0) await pause();
  } while (selectedOption !== 0);
};

const printWeather = (placeSelected, weatherPlace) => {
  console.log('\nPlace information\n');
  console.log('City: ', placeSelected.name);
  console.log('Lat: ', placeSelected.lat);
  console.log('Long: ', placeSelected.lon);
  console.log('Temp: ', weatherPlace.temp);
  console.log('Min: ', weatherPlace.min);
  console.log('Max: ', weatherPlace.max);
  console.log('Description: ', weatherPlace.desc);
};

main();
