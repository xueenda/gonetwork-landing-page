// Authenticate to Algolia Database.
//https://github.com/firebase/functions-samples/tree/master/fulltext-search

const functions = require('firebase-functions');
var firebase = require('firebase-admin');

const express = require('express');
const engines = require('consolidate');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './web/views');
app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    //response.send(`${Date.now()}`);
    const username = request.params.username;

    response.render('index', { username })
})


exports.app = functions.https.onRequest(app);

