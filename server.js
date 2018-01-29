'use strict';

const data = require('./db/notes');
const express = require('express');
console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(express.static('public'));
//===============================
//get all notes
app.get('/v1/notes', (req,res)=> {
  console.log(req.query);
  const {searchTerm} = req.query;
  if(searchTerm){
    const sendData = data.filter( item => {
      return item.title.includes(searchTerm);
    });
    res.json(sendData);
  }else{
    res.json(data);
  }
  
  
});
//================================
//get note == id
app.get('/v1/notes/:id', (req,res)=> {
  const id = Number(req.params.id);
  const sendData = data.find( item => item.id === id);
  res.json(sendData);
});
app.listen( 8080,  function() {
  console.info(`server start in ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
