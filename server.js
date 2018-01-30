'use strict';

const data = require('./db/notes');
const express = require('express');
console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(express.static('public'));
app.use(express.json());
const {PORT} = require('./middle_wares/config');
const simDB = require('./db/simdb');
const notes = simDB.initialize(data);
const {logger} = require('./middle_wares/logger');
app.use( logger);
//===============================
//get all notes
app.get('/v1/notes', (req,res,next)=> {
  const {searchTerm} = req.query;
  notes.filter(searchTerm, (err, list) => {
    if(err){
      return next(err);
    }
    console.log('all route success');
    res.json(list);
  });
});

//================================
//get note == id
app.get('/v1/notes/:id', (req,res,next)=> {
  const myId = Number(req.params.id);
  notes.find(myId, (err, item) => {
    if(err) console.error(err);
    console.log('get route/ id');
    res.json(item);
  });
  // const id = Number(req.params.id);
  // const sendData = data.find( item => item.id === id);
  // res.json(sendData);
});

//===============================
app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObj = {};
  const updateFields = ['title', 'content'];

  // validating updateObj if it only contain title and content props
  updateFields.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if(err){
      return next(err);
    }
    if(item){
      console.log('update success',item);
      res.json(item);
    }
    else next();
  });
});
//=================================
// error handle 404 and run time
// function catch404(req,res,next){
//   var err = new Error('Not Found');
//   console.log(err);
//   err.status = 404;
//   res.status(404).json({message:' message: not found'});
//   next(err);
// }

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
