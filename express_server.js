
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");//add body parser so it is readable for humans
const cookieParser = require('cookie-parser');// add cookies
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs"); //  Set ejs as the view engine

/////////////SERVER//////////////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
////////////////Object to Store userdata///////////////

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

////////////////////////////////
// Post route for submission form
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);       
});

// redirect POST for shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
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
  const templateVariables =   { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]] 

  }
  res.render("urls_index", templateVariables);
});

// Render new template
app.get("/urls/new", (req, res) => {
  const templateVariables = {
    user: users[req.cookies["user_id"]] 
  }
  res.render("urls_new", templateVariables);
});

// Render info about single URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVariables = {
    user: users[req.cookies["user_id"]] ,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }
  res.render("urls_show", templateVariables);
});

// DELETE URLS from database
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  // console.log(urlDatabase.params);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// make the changes to the edit on show url page
app.post("/u/:shortURL/", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
});

/////////might not need/////
//render login page
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"]
  const templateVariables = {
    user: null //users[req.cookies["user_id"]] 
  }
  res.render("urls_login", templateVariables );
});

// endpoint for /login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  //check email and passwords in database
  if (emailLookUp(email) && passwordLookUp(password)) {
    res.cookie('user_id', userLookUp(email,password));
    //if not go register
  } else if (!emailLookUp(email)) {
    res.redirect("/register");
    // report error for missing password or anything else!
  } else {
    res.status(400).send('an error has occured!');
  }
  res.redirect("urls");
});

// endpoint for /logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

// render registration page
app.get("/register", (req, res) => {
  const templateVariables = {
    user: users[req.cookies["user_id"]] 
  }
  res.render('urls_register', templateVariables);
});

//Post register endpoint
app.post("/register", (req, res) => {
  const randomID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // loops through users to check if email is already in use
  if(emailLookUp(email)) {
    res.status(400).send('email already in use')
  };
  //assigns attributes to the following user
  users[randomID] = {};
  users[randomID]['id'] = randomID;
  users[randomID]["email"] = email;
  users[randomID]["password"] = password;
  // sends status message if any field is left blank
  if (email === ""||password === "") {
    res.status(400).send("an error has occured!");
  } else {
    res.cookie('user_id', randomID) ;
    res.redirect("/urls");
  }
});

const emailLookUp = (inputEmail) => {
  for (let key in users) {
    if (inputEmail === users[key].email){
      return true;
    }
  }
};

const passwordLookUp = (inputPassword) => {
  for (let key in users) {
    if (inputPassword === users[key].password){
      return true;
    }
  }
};

const userLookUp = (emailLookUp,passwordLookUp) => {
  return Object.keys(users).find((user) => {
    if(users[user].email != emailLookUp || users[user].password != passwordLookUp) {
      return false;
    } else {
      return true;
    }
  })
};

// console.log(userLookUp("user2@example.com","dishwasher-funk")); 

// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

const generateRandomString = () => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghejklmnopqrstuvwxyz1234567890';
  //// result 6 random characters. 
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return randomString;
};
