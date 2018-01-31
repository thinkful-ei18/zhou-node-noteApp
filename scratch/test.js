'use strict';
const request = require('request');
function retriveTempData(options, apiCallback) {
  const {zipCode, cityAndState} = options;
  // error handling
  if (!zipCode && !cityAndState) {
    return apiCallback(Error('Zipcode or \'City, State\' required.'));
  }
  // set query string based on parameters
  let locationData;
  if (zipCode) {
    locationData = `zip=${zipCode}`;
  } else {
    locationData = `q=${cityAndState}`;
  }
  const uri = `https://api.openweathermap.org/data/2.5/weather?${locationData},us&appid=a69387aa26427965561ff0aa36f8ae7e&units=imperial`;

  request.get(uri, apiCallback);
}

module.exports = retriveTempData;

