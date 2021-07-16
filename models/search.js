const axios = require('axios');
const Fs = require('fs');

class Search {
  searchHistory = [];
  filePath = 'db/data.json';
  get paramms() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: parseInt(process.env.MAPBOX_LIMIT),
      language: process.env.MAPBOX_LANG,
    };
  }

  get weatherParams() {
    return {
      lang: process.env.OPENWATHER_LANG,
      units: process.env.OPENWATHER_UNITS,
      appid: process.env.OPENWATHER_KEY,
    };
  }
  constructor() {
    //TODO read DB if exist
    this.readDb();
  }

  async searchPlace(place = '') {
    // TODO Hppt request
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramms,
      });

      const { status, data } = await instance.get();

      const features = data.features.map((city) => ({
        id: city.id,
        name: city.place_name,
        lon: city.center[0],
        lat: city.center[1],
      }));

      return features;
    } catch (error) {
      // Returns empty array in case nothings appears
      console.log(error);
      return [];
    }
  }

  async weatherPlace(plaseSelected = {}) {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: {
          ...this.weatherParams,
          lat: plaseSelected.lat,
          lon: plaseSelected.lon,
        },
      });
      this.saveHistory(plaseSelected);

      const response = await instance.get();

      const { weather, main } = response.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      return error;
    }
  }

  saveHistory(place = {}) {
    if (!this.searchHistory.find((obj) => obj.id === place.id)) {
      this.searchHistory.unshift(place);
      if (this.searchHistory.length > 5) this.searchHistory.pop();
      Fs.writeFileSync(this.filePath, JSON.stringify(this.searchHistory));
    }
  }

  readDb() {
    if (Fs.existsSync(this.filePath)) {
      const dataFile = Fs.readFileSync(this.filePath, { encoding: 'utf-8' });
      this.searchHistory = JSON.parse(dataFile);
      return;
    } else {
      Fs.writeFileSync(this.filePath, JSON.stringify(this.searchHistory));
    }
  }
}

module.exports = Search;
