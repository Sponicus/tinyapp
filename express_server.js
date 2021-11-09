
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs") //  Set ejs as the view engine

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


// Get JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Get body -- World should be bold.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Pass urlDatabase to template
app.get('/urls', (req, res) => {
  templateVariables =   { urls: urlDatabase };
  res.render("urls_index", templateVariables)
});

// Render info about single URL
app.get('urls/:shortURL', (req,res) => {
  templateVariables = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show.ejs", templateVars);
});