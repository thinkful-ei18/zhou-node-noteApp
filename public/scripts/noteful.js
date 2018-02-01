/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {
    const editForm = $('.js-note-edit-form');
    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);
    if (store.creating) {
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
      api.details(noteId)
        .then(response => {
          store.currentNote = response;
          render();
        })
        .catch(err => console.log(err))
    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();
      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? {
        searchTerm
      } : {};
      api.search(store.currentSearchTerm)
        .then(response => {
          store.notes = response;
          render()
        })
        .catch(err => console.log(err))
    })
  }
  
  function handlenoteFormSubmit() {
    $('.js-note-edit-form').submit(event => {
      event.preventDefault();
      const editForm = $(event.currentTarget);
      const noteObj = {
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val(),
      }
      if (store.creating) {
        console.log('creating')
        // do something about creating
        api.create(noteObj)
          .then((res) => {
            console.log(res)
            store.createNote(res) // set currentNote && turn creating = false && push newItem
            render();
          })
          .catch(err => console.log(err))
      } else {
        console.log('updating')
        const id = store.currentNote.id;
        api.update(id, noteObj)
          .then(updateRes => {
            store.updateNote(id, updateRes)
            render();
          })
          .catch(err => console.log(err))
      }

    });
  }

  function handleCreateNewItem() {
    $('.js-note-edit-form').on('click', '#new-btn', event => {
      store.creating = true;
      console.log('creating new')
      // store.currentNote = null;
      render();
    });
  }

  function handleDeleteItem() {
    $('.js-note-edit-form').on('click', '#delete-btn', event => {
      const id = store.currentNote.id;
      api.delete(id)
        .then((res) => {
          console.log('delete success');
          store.notes = store.notes.filter(note => note.id !== id);
          store.currentNote = false;
          render();
        })
        .catch(err => console.log(err));
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