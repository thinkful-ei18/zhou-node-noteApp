/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {

    const editForm = $('.js-note-edit-form');
    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);
    console.log(store.currentNote);
    if(!store.currentNote){
      editForm.find('.js-note-title-entry').val('');
      editForm.find('.js-note-content-entry').val('');
      return;
    }
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId, response => {
        store.currentNote = response;
        render();
      });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();
      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm =  searchTerm ? { searchTerm } : {};
      
      api.search(store.currentSearchTerm, response => {
        console.log(response);
        store.notes = response;
        render();
      });
    });
  }

  function handlenoteFormSubmit() {
    $('.js-note-edit-form').submit( event => {
      event.preventDefault();

      const editForm = $(event.currentTarget);
      const noteObj = {
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val(),
      };
      console.log('my submit obj', noteObj);
      console.log('creating: ', store.creating);
      if(store.creating){
        // do something about creating
        api.create(noteObj, (res) => {
          //return the obj{id title content}
          console.log('create success');
          store.creating = false;
          store.currentNote = res;
          console.log('before', store.notes);
          store.notes.push(res);
          console.log('after',store.notes);
          render();
        });
        render();
      }else{
        noteObj.id = store.currentNote.id;
        api.update(noteObj.id, noteObj, updateRes => {
          console.log('client/noteful');
          store.currentNote = updateRes;
          const oldNote = store.notes.find( note => note.id === noteObj.id);
          Object.assign(oldNote, updateRes);
          render();
        });
      }

    });
  }

  function handleCreateNewItem(){
    $('.js-note-edit-form').on('click','#new-btn', event => {
      store.creating = true;
      store.currentNote = null;
    });
  }

  function handleDeleteItem(){
    $('.js-note-edit-form').on('click','#delete-btn', event => {
      const id = store.currentNote.id;
      api.delete(id, (res) => {
        console.log('delete success');
        store.notes = store.notes.filter( note => note.id !== id);
        store.currentNote = false;
        render();
      });
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handlenoteFormSubmit();
    handleCreateNewItem();
    handleDeleteItem();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
