// import { promisify } from "util";

function coinFlip(delay) {
  console.log('running coinflip')
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const isRunning = Boolean(Math.round(Math.random()))
      isRunning ? resolve('Head!') : reject('Tail!')
    }, delay)
  })
}

Promise.all([coinFlip(1),coinFlip(1),coinFlip(1)])
  .then(result => console.log(result))
  .catch(err => console.log(err))

