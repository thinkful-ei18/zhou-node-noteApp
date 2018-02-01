const express = require('express');
const router = express.Router();
const data = require('../db/notes.json');
const simDB = require('../db/simdb');
const notes = simDB.initialize(data);
// router.use(express.json());

//get all notes
router.get('/notes', (req, res, next) => {
  let searchTerm = Object.keys(req.query).length > 0 ?
    req.query.searchTerm :
    null
  notes.filter(searchTerm)
    .then((list) => {
      list ? res.json(list) : next()
    })
    .catch(next)
});
//================================
//get note == id
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then((note) => {
      res.json(note);
    })
    .catch(next)
});
//===============================
//create data
router.post('/notes', (req, res, next) => {

  //validate incoming client req
  //required fields: title content;
  const incomingItem = req.body;
  const noteObj = {};
  const requiredKeys = ['title', 'content'];
  for (let field of requiredKeys) {
    if (!(field in incomingItem)) {
      return next(Error(`missing ${field}`));
    }
    noteObj[field] = incomingItem[field];
  }
  //create note
  notes.create(noteObj)
    .then(res_item => {
      console.log('create new Item success');
      res.json(res_item);
    })
    .catch(next)
});
//===============================
// update data
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateData = req.body;
  const updateObj = {};
  const requiredFields = ['title', 'content'];
  for (let field of requiredFields) {
    if (field in updateData) {
      updateObj[field] = updateData[field];
    }
  }
  notes.update(id, updateObj)
    .then((note) => {
      console.log(`update ${note.title} success`);
      res.json(updateObj);
    })
    .catch(next)
});
//==============================
//delete route
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then((res_note) => {
      res.send('delete success');
    })
    .catch(next)
});



module.exports = router;