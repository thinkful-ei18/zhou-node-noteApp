# Noteful Challenge

## Requirements

For this challenge, you'll build a basic note-taking API using Node/Express and a simple in-memory database. The starter repo contains a client applications which makes calls to the server.

Here are the requirements for this app:

* Setup your project using the starter provided
* Install `express` and setup a `start` command
* Implement a static server which hosts the noteful client app files
* Create 2 GET endpoints:
  * GET notes returns the full list of notes based on the search term. If no search term is found then it returns the full list of notes.
  * GET a note by ID returns a specific note based on the ID provided.

## Getting Started

You'll be working with the [noteful-app-v1](https://github.com/cklanac/noteful-app-v1.git) repo. It has the following branches to help guide you along the way.
# noteful-app-v1

Noteful V1. Course challenge to build a RESTful API using Node/Express, Mocha, Chai and Continuous Integration via Travis CI.

## Overview

The repo provides several branches to serve as starters, solutions and hints along the way.

* **empty**: base branch used for code reviews

* **master**: Starting Point and default working branch

* **solution/1-basics**: solution for basic node and express application using `express.static` and 2 GET endpoints.

* **solution/2-middleware**: solution for adding the `sim-db` and `logging` middleware.

* **solution/3-restful**: solution for adding RESTful endpoints with callback style queries to `sim-db`

* **solution/4-promises**: solution for converting callbacks to promises

* **solution/5-testing**: solution for testing and continuous integration

* **solution/6-extra-credit**: solution for converting promises to async-await and additional modularization


**To get started**, you'll need to [clone](https://help.github.com/articles/cloning-a-repository/) the [noteful-app-v1](https://github.com/cklanac/noteful-app-v1.git) repo to your local development environment.

Go to the [noteful-app-v1](https://github.com/cklanac/noteful-app-v1.git) on GitHub and click the green "Clone or download" button, then in the pop-up click on the "Copy to clipboard" icon to copy the URL to your clipboard.

In your terminal,`cd` into the directory where you want to manage your project. At the command prompt, type the following `git clone ` (including a space after the word `clone`) then paste the URL you copied from GitHub after that on the command line and press enter.

Using HTTPS

```sh
git clone https://github.com/cklanac/noteful-app-v1.git
```

Using SSH

```sh
git clone git@github.com:cklanac/noteful-app-v1.git
```

Once the cloning process is complete, `cd` into the new folder named `noteful-app-v1` and enter `git status` on the command line. You should see "nothing to commit, working tree clean" message.

Next, go back to GitHub and use the "+" icon in the top right corner of the header to create a new repo in the Cohort Github Organization called "[YOUR-NAME]-noteful-v1" (do *not* initialize the repository with a README). On the next screen, under the heading "Quick setup — if you’ve done this kind of thing before" click the "Copy to clipboard" icon to copy the SSH URL of your new repository to the clipboard.

Back in the terminal window, enter `git remote set-url origin ` then paste the new repository's URL you just copied from GitHub and press enter. Enter `git remote -v` and you should see a remote called origin pointing to your new repository on GitHub for both fetch and push.

Using HTTPS

```sh
git remote set-url origin https://github.com/[COHORT]/[YOUR-NAME]noteful-app.git
```

Enter `git push` on the command line, then go back to GitHub and refresh the page. You should see the contents of your local repo are now up on GitHub inside your own account.

If you run `node server.js` in your terminal, you'll get an error, Let's fix that.

## Install Express Package and setup a Start script

In the terminal window, enter `npm install express` which will install the Express package and insert a reference in the `dependencies` property of your `package.json` file. Open the `package.json` file and you should see the following:

```json
  ...
  "dependencies": {
    "express": "^4.16.2"
  }
```

While still in the file, add a `"start": "node server.js"` command to the `scripts` property. This will allow you to run `npm start` which will in-turn execute the `node server.js` command.

```json
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  ...
```

Once your dependencies have downloaded, open the project in your text editor and start your local dev server using `npm start`. Or, if you'd like to automatically reload on source code upon changes, then run `nodemon server.js`.

Now, if you run `node server.js` in your terminal you should see a 'Hello Noteful!' message in the console.

## Create Express App and setup a Static Server

In 3 easy steps,, we'll create a simple Express app that can server static files.

1) Open `server.js` file and add `const app = express();` to create an express app.
2) Next add `app.use(express.static('public'));` which tells node to use the `express.static` built-in middleware. You can find more information in the [Serving static files in Express](https://expressjs.com/en/starter/static-files.html) documentation.
3) Add `app.listen(8080)` which starts the server and listens on port 8080 for connections.

The resulting `server.js` file should look something like this.

```js
'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();
app.use(express.static('public'));

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

```

At this point, you should be able to browse to `http://localhost:8080/` in Chrome and it should display the basic Noteful app. But if you look in Chrome Dev Tools you'll see the following error:

```txt
Failed to load resource: the server responded with a status of 404 (Not Found) :8080/v1/notes/
```

This is because we have not setup the proper GET endpoint for the application. Let's do that now.

## Create GET notes list and details endpoints

The client is expecting to find endpoints which match RESTful guideslines, which you'll learn more about later. You will create 2 endpoints.

1) GET `/v1/notes` returns a list of notes. Later, we'll add the ability to search/filter notes as well
2) GET `/v1/notes/:id` returns a specific note based on the ID provided.

Start by adding the following to your server.js to return the array of notes.

```js
app.get('/v1/notes', (req, res) => {
  res.json(data);
});
```

Test the endpoint using Postman. It should return an array with the 10 notes in `/db/notes.json`. If that works then check it with the sample client.

The client should load and display the list of notes in the client. The client is already wired-up to listen for click events and call `api.details(id)` to retrieve the item.

Next, you need to create the proper GET details endpoint which accepts an ID using [named route parameters](https://expressjs.com/en/guide/routing.html#route-parameters). Using the ID passed, find the correct note in the array and return it using [`.json()` method](https://expressjs.com/en/4x/api.html#res.json). Below is a hint on how to retrieve the item using the [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method.

```js
data.find(item => item.id === id);
```

## Update the client and server to support a search

Again, the client is already wired-up. The search form submit event handler function builds a query object with a `searchTerm` property and passes it to `api.search()`. The `api.search()` method passes the object to `$.ajax` which transforms the object into a query-string like this: `{ searchTerm : cats }` becomes `?searchTerm=cats`

In `server.js` you need to update the `app.get('/v1/notes', ...)` endpoint you created earlier to retrieve the query-string on the [req.query](https://expressjs.com/en/4x/api.html#req.query) object.

Once you have the `searchTerm`, you can search the array to find the proper results. There are several ways to accomplish this task. Might we suggest [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [String.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes). Once you've obtained the proper set, update `res.json(data)` to return the filtered list.
