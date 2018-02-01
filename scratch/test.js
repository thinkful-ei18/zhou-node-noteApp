function coinFlip(delay) {
  console.log('running coinflip')
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const isRunning = Boolean(Math.round(Math.random()))
      isRunning ? resolve('Head!') : reject('Tail!')
    }, delay)
  })
}

coinFlip(1)
  .then(result => {
    console.log(result)
    return coinFlip(1)
  })
  .then(result => {
    console.log(result)
    return coinFlip(1)
  })
  .then(result => {
    console.log('you win')
  })
  .catch(err => console.log(err))