// Authenticate to Algolia Database.
//https://github.com/firebase/functions-samples/tree/master/fulltext-search

const functions = require('firebase-functions');
var admin = require('firebase-admin');
const validator = require('validator');

const privateConfigs = functions.config();
const express = require('express');
const engines = require('consolidate');
const mcapi = require('mailchimp-api/mailchimp');
const mailchimp_key = privateConfigs.mailchimp.key;
const mailchimp_listid = privateConfigs.mailchimp.listid;
const mailchimp_presale_listid = privateConfigs.mailchimp.presale_listid;

admin.initializeApp(privateConfigs.firebase);

const database = admin.database();


try {
    var mc = new mcapi.Mailchimp(mailchimp_key);

} catch (error) {
    console.log(error.message);
}



const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './web/views/');
app.set('view engine', 'hbs');

app.get('/', (request, response) => {

    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    const username = request.params.username;

    response.render('index2', { username })
})


app.get('/slack', (request, response) => {
    response.redirect('https://afternoon-castle-59812.herokuapp.com/');
})



//subscribe user to our mailchimp
app.post('/subscribe', (request, response) => {
    console.log('body: ' + JSON.stringify(request.body));
    if(validator.isEmail(request.body.email)){
      mc.lists.subscribe({ id: mailchimp_listid, email: { email: request.body.email } }, function (data) {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({ "message": "Please check your email and confirm your subscription!" }));
    }, function function_name(error) {
        console.log(error);
        response.statusCode = 401;
        if(error.code == 214){
            response.send(JSON.stringify({ "message": "Already Registered"}));
        }else{
            response.send(JSON.stringify({ "message": "retry"}));
        }

    });

    }else{
         response.statusCode = 401;
         response.send(JSON.stringify({ "message":"invalid email"}));
    }
});


//subscribe user to our mailchimp presale
app.post('/presale/subscribe', (request, response) => {
    console.log(request.body)
    console.log(validator.isEmail(request.body.email));
    if(validator.isEmail(request.body.email)){
        mc.lists.subscribe({ id: mailchimp_presale_listid, email: { email: request.body.email } }, function (data) {
            database.ref('presale/users').push(request.body);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({ "message": "Please check your email and confirm your subscription!" }));
        }, function function_name(error) {
            console.log(error)
            console.log(error);
            response.statusCode = 401;
            if(error.code == 214){
                response.send(JSON.stringify({ "message": "Already Registered"}));
            }else{
                response.send(JSON.stringify({ "message": "retry"}));
            }
        });

    }else{
         response.statusCode = 401;
         response.send(JSON.stringify({ "message":"invalid email"}));
    }
});


exports.app = functions.https.onRequest(app);

