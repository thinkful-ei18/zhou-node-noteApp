'use strict';

const data = require('./db/notes');
const express = require('express');
console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();

//hosting client side assets
app.use(express.static('public'));

//import bodyParcer ? What does bodyParcer do?
app.use(express.json());
const {PORT} = require('./config');

// import and use morgan logger
const morgan = require('morgan');
app.use(morgan('dev'));

//===============================
// import notes router and mount the router path
const notesRouter = require('./routers/notes.router');
app.use('/v1', notesRouter);


//=================================
// error handle 404 and run time
app.use( (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 501);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen( PORT,  function() {
  console.info(`server start in ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
