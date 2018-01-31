'use strict';
const retrieveTempData = require('./app.js');


// example callback function
function logResults(error, response, body) {
  if (error) {
    console.error(error);
    return;
  }

  const results = JSON.parse(body);
  if (results.cod !== 200) {
    console.error(`Whoops, something was wrong with your request.\n ${results.cod} - ${results.message}`);
    return;
  }
  console.log(`The current temperature in ${results.name} is ${results.main.temp} Fahrenheit.`);
}

// The function can accept either a zipcode (number or string) or 'city, state' (string)
retrieveTempData({
  zipCode: 75065
}, logResults);
retrieveTempData({
  cityAndState: 'Eau Claire, WI'
}, logResults);

// These will throw a 'city not found' error
// retrieveTempData({zipCode: '1234567890'}, logResults);
// retrieveTempData({cityAndState: 'ImaginaryMadeUpVille'}, logResults);

// These will throw a 'Zipcode or 'City and State' required' error.
// retrieveTempData({}, logResults);
// retrieveTempData({fakeParameter: 5555534}, logResults);