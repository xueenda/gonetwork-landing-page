/*
Tut: https://www.youtube.com/watch?v=LOeioOKUKI8&t=632s
Getting started:
firebase login
  505  firebase logout
  506  firebase login
  507  firebase use
  508  firebase init
  509  firebase init hosting
  510  firebase init functions
  512  cd functions/
  513  ls -la
  514  npm i express --save
  
npm i handlebars consolidate -i

> Deploy:
Go to root then, 
firebase deploy
*/


const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


var webApp = require('./web/webapp.js');
exports.app = webApp.app;