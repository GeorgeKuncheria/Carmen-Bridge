//This app.js will work as the entry point to this aplication

//We are using Express Node.js framework
const express = require("express");
const app = express(); //initialling express, and 'app' is an instance of it
const port = 5000; //localhost:5000, it will run on port 5000
const middleware = require("./middleware"); // to be able to access middleware.js
const path = require("path"); //using the build in 'path' library
const bodyParser = require("body-parser"); //- when we submit a form, the data that is sent to the user is sent in a request body, this dependency lets us do that.
const mongoose = require("./database"); //- the database connection file 'database.js'
const session = require("express-session"); // the session object
const MongoStore = require("connect-mongo");
const helmet = require("helmet");

//'const server' takes two parameters the port number and a call back
const server = app.listen(port, () =>
  console.log("Server listening on port " + port)
);
const io = require("socket.io")(server, { pingTimeout: 60000 });

// template engine lets us use template files
// template file is just a HTML page which has placeholders for the data we will pass from our server
app.set("view engine", "pug");
//to get the template it will go to the folder "views" to get its template.
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false })); // extended: false = means the body will only be able to contain key value pairs made of strings or arrays

// telling it that we will be using all the files in the 'public' folder as static(files which don't have the server loading anything for them.)
app.use(express.static(path.join(__dirname, "public")));

// setting the app uses sessions, so here we are signing the sessions or hashing the sessions
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  session({
    // session is hashed using this secret
    secret: "EDM is melody",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: false,
    },
    resave: true, // bcs the documentation has it
    saveUninitialized: false, // prevents the session from being saved uninitialised
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://admin:musicbox@musicbox.z5l02.mongodb.net/MusicBoxDB?retryWrites=true&w=majority",
      ttl: 1000 * 60 * 60 * 2,
    }),
  })
);

// Routes
const loginRoute = require("./routes/loginRoutes"); // we're getting this from the 'loginRoutes.js' page(we have exported our 'loginRoutes' page so we are able to use it)
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logout");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const searchRoute = require("./routes/searchRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const notificationsRoute = require("./routes/notificationRoutes");

// Api routes
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");
const chatsApiRoute = require("./routes/api/chats");
const messagesApiRoute = require("./routes/api/messages");
const notificationsApiRoute = require("./routes/api/notifications");

app.use("/login", loginRoute); // any request that comes through '/login', will be handled thro 'loginRoute'
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);

app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute);

// 'req' is the request which is incoming to this path here
// 'res' is what we use to send the data back to the user
// middleware(a seperate step along the req res path before executing the
//- function it will do the middleware, which comes first)
app.get("/", middleware.requireLogin, (req, res, next) => {
  //payload is generally the term we use to
  //refer to the data we are sending to a function or a page etc
  var payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user, // this will fetch us the information about the user loggen, which we can use in our home page
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  // '200' is a success code (just like 404 is for failure)
  // it will render the home page when triggered to be successful
  // render takes 2 params, page title and the payload to render it
  res.status(200).render("home", payload);
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join room", (room) => socket.join(room));
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("notification received", (room) =>
    socket.in(room).emit("notification received")
  );

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
