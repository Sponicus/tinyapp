
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");//add body parser so it is readable for humans
app.use(bodyParser.urlencoded({extended: true}));

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

////////////////////////////////
// Post route for submission form
app.post("/urls", (req, res) => {
  // console.log(req.body.longURL);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);       
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
  const templateVariables =   { urls: urlDatabase };
  res.render("urls_index", templateVariables);
});

// Render new template
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Render info about single URL
app.get("/urls/:shortURL", (req, res) => {
console.log(req.params.shortURL);
  const templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] //req.params.longURL 
  };
  console.log(templateVariables.longURL);
  res.render("urls_show", templateVariables);
});


function generateRandomString() {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghejklmnopqrstuvwxyz1234567890';
  //// result 6 random characters. 
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return randomString;
};

// console.log(generateRandomString());