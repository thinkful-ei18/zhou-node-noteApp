'use strict';
const express = require('express');
const router = express.Router();
const data = require('../db/notes.json');
const simDB = require('../db/simdb');
const notes = simDB.initialize(data);
// router.use(express.json());

//get all notes
router.get('/notes', (req,res,next)=> {
  let searchTerm = null;
  if(Object.keys(req.query).length >0){
    searchTerm = req.query.searchTerm;
  }
  notes.search(searchTerm, (err,list) => {
    if(err){
      return next(err);
    }
    console.log('fetch all notes success.');
    res.json(list);
  });
});

//================================
//get note == id
router.get('/notes/:id', (req,res,next)=> {
  const id = req.params.id;
  notes.find(id, (err, note) => {
    if(err){
      return next(err);
    }
    if(!note){
      return next(err);
    }
    console.log(`get ${id} successful`);
    res.json(note);
  });
});
//===============================
//create data
router.post('/notes', (req,res,next) => {
  
  //validate incoming client req
  //required fields: title content;
  const incomingItem = req.body;
  console.log('incoming request: ',req.body);
  const noteObj = {};
  const requiredKeys = ['title', 'content'];
  for(let field of requiredKeys){
    if(!(field in incomingItem)){
      return next(Error(`missing ${field}`));
    }
    noteObj[field] = incomingItem[field];
  }

  //create note
  notes.create(noteObj, (err, res_item) => {
    console.log('create new Item success');
    res.json(res_item);
  });
});
//===============================
// update data
router.put('/notes/:id', (req, res,next) => {
  const id = req.params.id;
  const updateData = req.body;

  const updateObj = {};
  const requiredFields = ['title', 'content'];

  for(let field of requiredFields) {
    if(field in updateData){
      updateObj[field] = updateData[field];
    }
  }

  notes.update(id, updateObj, (err,note) => {
    if(err){
      next(err);
      return;
    }
    if(!note){
      console.log(Error(`${id} not found in database`));
      return next(err);
    }

    console.log(`update ${updateObj.title} success`);
    res.json(updateObj);
  });
});
//==============================
//delete route
router.delete('/notes/:id', (req,res,next) => {
  const id = req.params.id;
  notes.delete(id, (err, res_note) => {
    if(err){
      return next(err);
    }
    res.send('delete success');
  });
});



module.exports = router;
