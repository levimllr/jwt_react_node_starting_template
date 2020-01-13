var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// encrypt and decrypt passwords
var bcrypt = require('bcryptjs');
// handle signing token before sending to client
const jwt = require('jsonwebtoken');
// set server secret to verify client tokens
const exjwt = require('express-jwt');

const PORT = process.env.PORT || 3001;
var app = express();

// Requiring our models for syncing
var db = require("./models");

/*========= Here we want to let the server know that we should expect 
and allow a header with the content-type of 'Authorization' ============*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

/*========= This is the typical node server setup so we can be able to parse 
the requests/responses coming in and out of the server ============*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*========= Here we will set up an express jsonwebtoken middleware
(simply required for express to properly utilize the token for requests) 
You MUST instantiate this with the same secret that will be sent to the client 
============*/
const jmtMW = exjwt({
  secret: 'keyboard cat 4 ever'
});

/* This is SUPER important! This is the route that the client will be passing 
the entered credentials for verification to. If the credentials match, 
then the server sends back a json response with a valid json web token 
for the client to use for identification. */
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.user.create({
      username: username,
      password: hash
    }).then(result => {
      console.log("User created: ", result);
      res.json("user created!");
    });
  });
});

app.post('/login-in', (req, res) => {
  const { username, password } = req.body;
  console.log("User submited: ", username, password);
  
  db.user.findOne(
    {
      where: { username: username}
    })
    .then(user => {
      console.log("user Found:", user);
      if (user === null) {
        res.json(false);
      };
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          console.log("Valid!");
          let token = jwt.sign({ 
            username: user.username}, 
            'keyboard cat 4 ever', 
            { expiresIn: 129600 }); // signing the token
          res.json({
            success: true,
            err: null,
            token
          });
        } else {
          console.log("Entered password and hash do not match!");
          res.status(401).json({
            success: false,
            token: null,
            err: 'Entered password and hash do not match!'
          });
        };
      });
    });
});

app.get('/', jmtMW /* using the express jwt MW here */, (req, res) => {
  console.log("Web token checked");
  res.send('You are authenticated'); // send some response when authenticated
});

db.sequelize.sync().then(() => {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
})


module.exports = app;
