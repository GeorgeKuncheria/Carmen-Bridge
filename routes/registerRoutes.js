const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser"); //- when we submit a form, the data that is sent to the user is sent in a request body, this dependency lets us do that.
const bcrypt = require("bcrypt"); //- to hash passwords
const User = require("../schemas/UserSchema"); //- using the link to user schema, we can use the userSchema from this file
const sanitize = require("mongo-sanitize");

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false })); // extended: false = means the body will only be able to contain key value pairs made of strings or arrays

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});
// 'async' pertains to using an 'await' function, we can only use an 'await' function unside an 'async' function.
router.post("/", async (req, res, next) => {
  var firstName = sanitize(req.body.firstName.trim());
  var lastName = sanitize(req.body.lastName.trim());
  var username = sanitize(req.body.username.trim());
  var email = sanitize(req.body.email.trim());
  var password = sanitize(req.body.password);

  var payload = req.body; // will contain all the values the user entered in the form

  if (firstName && lastName && username && email && password) {
    //checking if they all have values
    // '{username: username}', it will go to the user collection and check for any row with the username of the inputted username
    // similarly email, and using '[ ]' lets check both of them in an array at once.
    // and the'$or' will check if whether any of these conditions is true, because we need both of them to be unique
    // we are using 'await', bcs it normally runs asynchronously and run the things below and outside the .then , while still running the stuff inside the function and then come back to the .then part once its done
    // so we don't want this behaviour, we ask it to wait until we check the function first and then run the things below it, and we dont have to use the .then part then
    // basically the await makes sure we wait for the result of that function and only after returning the result we go to the next part of the code
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })
      // queries like this return a promise, so we have to use .then and .catch for 'what to do next' and 'when failed or throws an error' respectively
      .catch((error) => {
        console.log(error);
        payload.errorMessage = "Something went wrong.";
        // and then we redirect them to the register page
        res.status(200).render("register", payload);
      });

    if (user == null) {
      // No user was found so we can insert them

      //req.data will have all the data they entered
      var data = req.body;
      //hashing function takes password and salt rounds, so 10 means it will be done 2 raised to 10 times
      data.password = await bcrypt.hash(password, 10);

      // 'User.create()' creates an object of the type in 'UserSchema', that fits into the user table(schema)
      // 'USer.create(data)' inserts the data into the schema
      User.create(data).then((user) => {
        req.session.user = user; //we are storing the new user(logged in user) in this session
        return res.redirect("/"); //redirecting them to the home page(Route level of our page)
      });
    } else {
      // User found, so we shoe an error message
      // 'email' is what they enetered , and user.email is the one in the DB
      if (email == user.email) {
        payload.errorMessage = "Email already in use.";
      } else {
        //if it wasnt the email in use , then obviously it should be the username in use
        payload.errorMessage = "Username already in use.";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("register", payload); //we'll render the register page and pass the payload back to the page, so they dont get erased on the screen
  }
});

module.exports = router;
