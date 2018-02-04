const express = require('express');
const router = express.Router();
const data = require('../db/notes.json');
const simDB = require('../db/simdb');
const notes = simDB.initialize(data);

//get all notes
router.get('/notes', (req, res, next) => {
  let searchTerm = Object.keys(req.query).length > 0 ?
    req.query.searchTerm :
    null
  notes.filter(searchTerm)
    .then((list) => {
      list ? res.status(200).json(list) : next()
    })
    .catch(next)
})

//================================
//get note == id
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id
  notes.find(id)
    .then((note) => {
      res.status(200).json(note);
    })
    .catch(next)
});
//===============================
//create data
router.post('/notes', (req, res, next) => {

  //validate incoming client req
  //required fields: title content;
  const incomingItem = req.body
  const noteObj = {}
  const requiredKeys = ['title', 'content']
  for (let field of requiredKeys) {
    if (!(field in incomingItem)) {
      return res.status(400).json({message:`missing ${field}`})
    }
    if(incomingItem[field] === '' || typeof incomingItem[field] !=='string'){
      return res.status(400).end()
    }
    noteObj[field] = incomingItem[field]
  }
  //create note
  notes.create(noteObj)
    .then(note => {
      console.log('create new Item success')
      res.status(201).json(note)
    })
    .catch(next)
});
//===============================
// update data
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id
  const updateData = req.body
  const requiredFields = ['title', 'content'];
  Object.keys(updateData).forEach( key => {
    if(!requiredFields.includes(key)){
      // console.log('what?????')
      return res.status(400).json({status:400, message:'invalid input'})
    }
  })
  notes.update(id, updateData)
    .then(note => {
      res.status(201).json(note)
    })
    .catch(next)
})
//==============================
//delete route
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then((res_note) => {
      res.status(200).json({
        status:200,
        message:'delete success'
      })
    })
    .catch(next)
})



module.exports = router;