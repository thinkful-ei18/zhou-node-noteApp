// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function(){

  function updateNote(id, updateData){
    store.currentNote = updateData;
    const oldNote = store.notes.find(note => note.id === id);
    Object.assign(oldNote, updateData);
  }
  function createNote(newNote){
    store.creating = false;
    store.currentNote = newNote
    store.notes.push(newNote);
  }
  return {
    notes: [],
    currentNote: false,
    currentSearchTerm: '',
    creating:false,
    updateNote,
    createNote
  };
  
}());
