// requests will be forewared from 'app.js' to this route

const express = require("express");
const app = express();
const router = express.Router(); //it will get us the router that comes with express.js
const bodyParser = require("body-parser"); //including body parser so we are able to use it
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");
const sanitize = require("mongo-sanitize");

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// 'router.get' because this page is handling just the route
// and not the traffic to the server like the 'app.js' file is doing.

router.get("/", (req, res, next) => {
  //we will render the page "login" for us, if its a successful request
  res.status(200).render("login");
});

router.post("/", async (req, res, next) => {
  var payload = req.body;
  // similar to 'registerRoutes' where we check if the user already exists
  if (req.body.logUsername && req.body.logPassword) {
    var user = await User.findOne({
      $or: [
        { username: sanitize(req.body.logUsername) },
        { email: sanitize(req.body.logUsername) },
      ],
    }).catch((error) => {
      console.log(error);
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("login", payload);
    });

    if (user != null) {
      //once we confirm its an existing user, we check and compare their password with the one in the DB
      // await keyword bcs its asynchronous, and we wait for this function to return our result, until we move on to the next part od the code
      var result = await bcrypt.compare(req.body.logPassword, user.password);

      // we're checking result is true, but we are also checking the type is boolean to be very sure
      if (result === true) {
        req.session.user = user;
        return res.redirect("/"); // if it matches we redirect them to the home page hence logging them in
      }
    }
    // when they dont match the username,passowrd pair, we send an error message
    payload.errorMessage = "Login credentials incorrect.";
    //and hence send them back to the login page
    // we are returning bcs, if we dont it will go ahead and do the 2 other error lines below it also, so to avoid that we return with this error right here
    return res.status(200).render("login", payload);
  }

  payload.errorMessage = "Make sure each field has a valid value.";
  res.status(200).render("login");
});
// we are exporting this file, so we can use it in other places too
module.exports = router;
