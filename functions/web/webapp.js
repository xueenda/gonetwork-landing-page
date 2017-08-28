// Authenticate to Algolia Database.
//https://github.com/firebase/functions-samples/tree/master/fulltext-search

const functions = require('firebase-functions');
var firebase = require('firebase-admin');

const express = require('express');
const engines = require('consolidate');
const mcapi = require('mailchimp-api/mailchimp');
const mailchimp_key = functions.config().mailchimp.key;
const mailchimp_listid= functions.config().mailchimp.listid;

try {
    //TODO: dont commit this!
    var  mc = new mcapi.Mailchimp(mailchimp_key);

} catch (error) {
    console.log(error.message);
}



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

//subscribe user to our mailchimp
app.post('/subscribe', (request, response)=>{
    console.log('body: ' + JSON.stringify(request.body));

    mc.lists.subscribe({id:mailchimp_listid ,email:{email:request.body.email}},function(data){
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify({ "message": "check your email and confirm your subscription" }));
    },function function_name (error) {
      console.log(error)

      response.statusCode = 401;
      response.send(JSON.stringify({ "message": "error setting up subscription, please retry" }));
    })
    //mc.lists.subscribe({id: req.params.id, email:{email:req.body.email}}, function(data) {
    //   req.session.success_flash = 'User subscribed successfully! Look for the confirmation email.';
    //   res.redirect('/lists/'+req.params.id);
    // },
    // function(error) {
    //   if (error.error) {
    //     req.session.error_flash = error.code + ": " + error.error;
    //   } else {
    //     req.session.error_flash = 'There was an error subscribing that user';
    //   }
    //   res.redirect('/lists/'+req.params.id);
    // });
      // response.setHeader('Content-Type', 'application/json');
      // response.send(JSON.stringify({ a: 1 }));
});

exports.app = functions.https.onRequest(app);

