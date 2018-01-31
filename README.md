# Noteful Challenge - RESTful

For this challenge, you'll replace the custom logger with Morgan, then you'll create an Express Router and move the existing routes from `server.js` into the router. This will clean up the `server.js` and set the stage to create additional functionality. Next, you'll create two new features, the ability to create **new** and **delete** Notes. We approach these tasks as "vertical" slices of functionality. IOW, you will implement the **create new note** feature on both the server and the client, and get it full working before moving on to **delete a note**. Contrast the "vertical" approach to the "horizontal" where you would implement all the server-side features before moving beginning work on the client. You will likely encounter both approaches "in-the-wild" but the vertical approach is becoming more prevalent the agile-community.

## Requirements

* Swap custom logger with Morgan
* Move endpoints to Express Router
* Implement save a new Note feature
* Implement delete a Note feature

## Replace custom logger with Morgan

Before getting started with the Express Router, let's replace the custom logger with Morgan. First, you need to install Morgan in your project. From the command line run the following command.

```sh
npm install morgan
```

> Remember that in NPM v5.x and up, saving the package to the dependencies property is now the default. So the `--save` flag is optional.

Check `dependencies` property in the `package.json` file to ensure it was inserted correctly.

In `server.js`, require and use Morgan. Recall, it is convention to place `require()` calls towards to the top of the file. And the `app.use()` method needs a valid Express `app` so it goes after `const app = express();` but before `app.use(express.static('public'));`. The start of your `server.js` file should look something like this:

```js
const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');

// Create an Express application
const app = express();

// Log all requests
app.use(morgan('dev'));

// Create a static webserver
app.use(express.static('public'));
...
```

Restart you app and make sure Morgan is logging requests properly. Does it log all requests to both static files and data endpoints?

## Move endpoints to Express Router

The `server.js` is beginning to look a bit clutters. Let's do something about that by moving the endpoints into a router.

First, create `router` folder and inside it, create a `notes.router.js` file.

Next follow these steps to setup your router:

* Express Router needs access to Express so require it and create a instance of a `router`
* Move the code to require and initialize the `simDb` from `server.js` to `notes.router.js`
* Move the endpoints from `server.js` to `router/notes.router.js`
* Change `app.METHOD` to `router.METHOD`
* Export the router

Your `notes.router.js` file should now look something like this (some code removed for brevity):

```js
const express = require('express');
const router = express.Router();

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  // remove for brevity
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  // remove for brevity
});

// Put update an item
router.put('/notes/:id', (req, res, next) => {
  // remove for brevity
});

module.exports = router;
```

Now, require and use the new router in `server.js`. Add the following 2 lines to your `server.js`. It is up to you to ensure they are added to the correct sections.

```js
const notesRouter = require('./routers/notes.router');
```

```js
app.use('/v1', notesRouter);
```

Restart you app and make sure everything is working properly. Using Postman, hit each endpoint. Does the request to logged properly and does the endpoint return the correct data? Open the app in your browser. Does the app still work correctly?

## Create new POST and DELETE endpoints

Congrats! Now let's implement the new and delete features. We'll walk you thru the new Note feature so you'll be ready to implement the delete Note on your own.

### Implement New Note feature

To add the new Note feature you'll need to update the code in several places. Below is a list of the steps, from user action to saving to database, involved in creating a new note.

* User clicks the `new` button to get a new Note form
* User fills in the details of the new note and clicks `save`
* Client-side JS (jQuery) captures the form submit and gathers the data
* Client-side JS preps the data and makes an AJAX request to the server
* Server-Side JS (Express) receives the request and validates the data
* If the data is valid, call the `notes.create` method
* When the new note has been created, send the results back to the client.
* Client-Side JS receives the result and updates store then calls `render()`

The above steps are in order, from start to finish. However, a good approach to developing a feature like this is to start on the server and work your way outwards. Let's begin...

#### Update the Server

In the notes router, create a POST `/notes` endpoint. Notice the similarities and differences between the POST & `notes.create` endpoint compared to the PUT & `notes.update`.

```js
// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});
```

Use Postman to confirm the endpoint is working by POSTing a new Note. Then, still using Postman, call the GET `/notes` endpoint. Does your new note show up in the list? When you call GET `/notes/:id` with the new ID, does it return properly?

#### Update the Client

Now that we know the server has a good POST `/notes` endpoint we update the client to commicate with it. That means starting with the `$.ajax` call. In the `/public/scripts/api.js` file add the following method to the API object.

```js
...
  create: function (obj, callback) {
    $.ajax({
      type: 'POST',
      url: '/v1/notes',
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(obj),
      success: callback
    });
  },
...
```

Now test your new `api.create()` method. Add this temporary bit of code the `/public/scripts/index.js` file right after the `api.search()` call.

```js
  const newNote = {
    title: 'new note',
    content: 'the body'
  }
  api.create(newNote, response => {
    console.log(response)
  });
```

Do you see a new note in the console? Using Postman, call the GET `/notes` endpoint. Do you see the new note in the list?

Great! Now we'll create a small form which when submitted will clear the edit form so we can submit a new Note. Insert the following form right after `<h2>Note</h2>` on line 34 of `/public/index.html`.

```html
    <article>
      <header>
        <h2>Note</h2>
        <!--Insert this form-->
        <form id="new-note-form" class="js-start-new-note-form">
          <button type="submit">new +</button>
        </form>

      </header>
      <form id="note-edit-form" class="js-note-edit-form">
   ...
```

Following the pattern we've established, create a new function with an Event Listener and Event Handler which listens for the form submit and clears the edit form by removing the `currentNote` and re-rendering the page.

In `/public/scripts/noteful.js` add the following function.

```js
function handleNoteStartNewSubmit() {
  $('.js-start-new-note-form').on('submit', event => {
    event.preventDefault();
    store.currentNote = false;
    render();
  });
}
```

Remember to add the function to the `bindEventListeners` function

```js
function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();

    handleNoteFormSubmit();
    handleNoteStartNewSubmit(); // <<== Add this
  }
```

Finally, update the existing `handleNoteFormSubmit()` function to conditionally call `api.update` or `ap.save`. There are several ways to tackle the conditional logic. The chosen solution checks to see if the `currentNote.id` exists. If it does then we must be editing, so send `api.update`. If `currentNote.id` is falsey then we must be adding so call `api.create`

```js
  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      if (store.currentNote.id) {

        api.update(store.currentNote.id, noteObj, updateResponse => {
          store.currentNote = updateResponse;

          api.search(store.currentSearchTerm, updateResponse => {
            store.notes = updateResponse;
            render();
          });

        });

      } else {

        api.create(noteObj, updateResponse => {
          store.currentNote = updateResponse;

          api.search(store.currentSearchTerm, updateResponse => {
            store.notes = updateResponse;
            render();
          });

        });
      }

    });
  }
```

Note, the nested `api.search()` call inside `api.update()` and `api.create`. This brute-force approach keeps the client's store in sync with the server. There are certainly better ways to accomplish this but it is beyond the scope of our challenge and better accomplished using frameworks such as React.

## Add Delete Note

Your challenge will be implement the delete note feature. We've provided the code for the delete button, but it is your responsiblity to implement the delete endpoint on the server as well as the event handler and api call.

To get started, add the following button to the `generateNotesList()` function.

```html
<button class="removeBtn js-note-delete-button">X</button>
```

Your `generateNotesList()` function should looks like this:

```js
function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }
```

Tasks:

* Create DELETE endpoint on server
* Create function to listen for the delete event on the client
* Create the AJAX in the `api.js` to send the request to the server
* Don't forget to add the event listener function to `bindEventListeners()`

Good Luck!