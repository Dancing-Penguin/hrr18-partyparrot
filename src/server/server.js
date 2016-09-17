var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var middleware = './middleware/middleware';
var stormpath = require('express-stormpath');
var Eventbrite = require('eventbrite-node');
var config = require('../config/eventbrite');
var Event = require('./models/event');
var User = require('./models/user');
var Promo = require('./models/promo');
var client = new Eventbrite(config.clientKey, config.clientSecret);

//Alias for heroku ports/db vs local
var PORT = process.env.PORT || 8080;
var db =  process.env.MONGODB_URI || 'mongodb://localhost/PartyParrot';
mongoose.connect(db);

//mongoose's promise library is depricated.
mongoose.Promise = global.Promise;
var app = express();

// Setups stormpath. The application:{href: https://..} is unique to the
// storm path application being used to do the authentication for this app.
// Please change this for your application
app.use(stormpath.init(app, {
  application:{
    href: 'https://api.stormpath.com/v1/applications/38BYzfpt1mubNI49Sj9nC4'
  },
  website: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));

app.get('/parrot', function(req,res){
  res.sendFile(path.join(__dirname, '/../public/parrot.html'));
})
//In the interest of time and speed we created one schema to avoid joins
app.post('/create',stormpath.loginRequired, function(req,res){
  var event = new Event({
  name: req.body.event.name.text,
  desc: req.body.event.description.text,
  promoters: [req.user.fullName],
  owner: req.user.username,
  gPoint: req.body.gPoint,
  gReward: req.body.gReward,
  sPoint: req.body.sPoint,
  sReward: req.body.sReward,
  bPoint: req.body.bPoint,
  bReward: req.body.bReward,
  eventbrite: req.body.event
  });
  event.save(function (err, post) {
    if (err) {console.error(err)}
    res.status(201).json('Hey I posted ' + post);
  });
});

// Returns all events independent of what user is logged in
app.get('/events', function (req, res, next) {
  Event.find(function(err, events) {
    if (err) { console.error(err) }
    res.json(events);
  })
})

// Returns events that only the user who is logged in has created
app.get('/userEvents', stormpath.loginRequired, function(req,res) {
  Event.find({'owner': req.user.username}, function(err, event) {
    if (err) console.error(err);
    res.json(event);
  })
})

// This is a hack to pass over username from stormpath to client side
app.get('/secrets', stormpath.loginRequired, function(req,res){
  // console.log(req.user.username)
  res.json(req.user.username);
})


// Will return array of all promoters for a specified event
// Expects {event: "eventname"}
// returns [{promoter: "username", event: "eventname", link: "bitlyLink"}]
app.get('/promoters', stormpath.loginRequired, function(req, res){
  Promo.find({'event': req.body.event}, function(err, promos){
    if (err) {
      console.log("Error: ", err);
      res.status(500).send({error: err});
    } else {
      res.json(promos);
    }
  });
});
// Note that the username returned will be each person's email
// Will need to refactor to return actual names with additional db query


// Adds new entry to promo table for event/promoter combo with unique link
// Expects {event: "eventname", link: "bitlyLink"}
app.post('/promoter', stormpath.loginRequired, function(req, res){
  var newPromoterObj = req.body;
  newPromoterObj.promoter = req.user.username

  Promo.create(newPromoterObj, function(err, promo){
    if (err) {
      console.log("Error: ", err);
      res.status(500).send({error: err});
    } else {
      res.status(200);
    }
  })
});


// Will return a single promoter object for a specified event
// Expects {event: "eventid"}
// if already a promoter, returns {link: "bitlyLink"}
// if not yet a promoter, returns {userid: 'id', link: null}
app.get('/promoter/:event', stormpath.loginRequired, function(req, res){
  Promo.findOne({'event': req.params.event, 'promoter': req.user.username}, 'link', function(err, promo){
    if (err) {
      console.log("Error: ", err);
      res.status(500).send({error: err});
    } else {
      if (!promo) { // current user is not a promoter for this event
        User.findOne({'username': req.user.username}, function(err, user){
          if (err) {
            console.log("Error: ", err);
            res.status(500).send({error: err});
          } else {  // return userid and bitly link
            res.json({'userid': 123456789, 'link': null}); //this is temporary fake
            // res.json({'userid': user['_id'], 'link': null});
          }
        });
      } else { // return bitly link
        res.json({'link': promo.link});
      }
    }
  });
});


// If no app.get path was found for request, this is the default, which will
// then use the react router
app.get('*', function (req, res) {
 res.sendFile(path.join(__dirname, '/../public/index.html'));
});



//Eventbrite auth. Currently single user.
app.get('/authentication', function(req, res){
  var authUrl = client.getOAuthUrl();
  res.redirect(authUrl);
  client.authorize(req.query.code, function(err, response) {
    if (err) {
      console.log.error(err);
      return;
    }
    console.log(response.access_token);
  });
});

//This is an entry point for stormpath integration.
app.on('stormpath.ready', function() {
  app.listen(PORT);
});

module.exports = app;
