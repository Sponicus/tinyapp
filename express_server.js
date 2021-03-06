
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");//add body parser so it is readable for humans
const cookieParser = require('cookie-parser');// add.session.user_idieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const cookieSession = require("cookie-session");
const {urlDatabase, emailLookUp, users, generateRandomString, urlsForUser, userLookUp, passwordLookUp, getUserByEmail} = require("./helper");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs"); //  Set ejs as the view engine
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//////remnant from one of the first tasks from compass/////
app.get("/", (req, res) => {
  const user = users[req.session.user_id];
  // if user is not logged in, redirect to login
  if (user === undefined) {
    res.redirect("/login");
  }
  res.redirect("urls");
});
/////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// create new short URLS
app.post("/urls", (req, res) => {
  const tempObj = {
    longURL: req.body.longURL,
    userID: users[req.session.user_id].id
  };
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = tempObj;
  res.redirect(`/urls/${shortURL}`);
});

// redirect POST for shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`);
});

// Get JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Get body -- World should be bold.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Pass urlDatabase to template
app.get("/urls", (req, res) => {
  if(req.session.user_id) {
    const id = req.session.user_id;
    const templateVariables =   {
      urls: urlsForUser(id),
      user: users[req.session.user_id]
    };
    res.render("urls_index", templateVariables);
  } else {
    res.send(`<html><body>Please go log in  </body><a href="/login">Login</a></html>\n`);
  }
});

// Render new template
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVariables = {
    user: users[req.session.user_id]
  };
  // if user is not logged in, redirect to login
  if (user === undefined) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVariables);
});

// Render info about single URL
app.get("/urls/:shortURL", (req, res) => {
  if(!Object.keys(urlDatabase).includes(req.params.shortURL)) {
    res.send(`<html><body>This URL does not exist! </body><a href="/login">Login</a></html>\n`);
  } else if (!req.session.user_id) {
    res.send(`<html><body>You do not have permission to view this URL  </body><a href="/login">Login</a></html>\n`);
  } else if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(400).send("THIS NOT YOURS TO EDIT!!! >:$");
  } else {
    const templateVariables = {
      user: users[req.session.user_id] ,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL
    };
    res.render("urls_show", templateVariables);
  }
});

// DELETE URLS from database
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id;
  if (urlsForUser(id)) {
    // console.log("this is what we are looking for -->>>", urlsForUser(id));
    let userUrls = urlsForUser(id);
    if (Object.keys(userUrls).includes(req.params.shortURL) ) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    } else {
      res.status(400).send("You do not have permission to delete this");
    }
  }
});

// make the changes to the edit on show url page
app.post("/u/:shortURL/", (req, res) => {
  const id = req.session.user_id;
  if (urlsForUser(id)) {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
  }
  res.redirect("/urls");
});

//render login page
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVariables = {
    user: null //users[req.session.user_id]
  };
  res.render("urls_login", templateVariables);
});

// endpoint for /login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserByEmail(email, users);
  if ( !userId ) {
    res.send('Email doesn\'t exist! Please go register :D');
    return;
    //if not go register
  } else if (!bcrypt.compareSync(password, users[userId].password))  {
    res.send('Incorrect username or password');
    // report error for missing password or anything else!
  } else if (bcrypt.compareSync(password, users[userId].password)) {
    req.session.user_id = userId;
  res.redirect("urls");
  }
  res.status(400).send('an unexpected error has occured!');
});

// endpoint for /logout
app.post("/logout", (req, res) => {
  req.session = null;
  // res.clearSession('user_id');
  res.redirect("/");
});

// render registration page
app.get("/register", (req, res) => {
  const templateVariables = {
    user: users[req.session.user_id]
  };
  res.render('urls_register', templateVariables);
});

//Post register endpoint
app.post("/register", (req, res) => {
  const randomID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // loops through users to check if email is already in use
  if (emailLookUp(email, users)) {
    res.status(400).send('email already in use');
  }
  //assigns attributes to the following user
  users[randomID] = {};
  users[randomID]['id'] = randomID;
  users[randomID]["email"] = email;
  users[randomID]["password"] = hashedPassword;
  // sends status message if any field is left blank
  if (email === "" || password === "") {
    res.status(400).send("an error has occured! please re-enter a valid username and password!");
  } else {
    req.session.user_id = randomID;
    res.redirect("/urls");
  }
});
