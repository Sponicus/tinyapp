const urlDatabase = {
  "b6UTxQ": {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  "i3BoGr": {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

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

//////////////////////// Functions//////////////////////
const emailLookUp = (inputEmail, database) => {
  for (let key in database) {
    if (inputEmail === database[key].email){
      return true;
    }
  }
};


const passwordLookUp = (inputPassword, database) => {
  for (let key in database) {
    if (inputPassword === database[key].password){
      return true;
    }
  }
};

const getUserByEmail = (inputEmail, database) => {
  for (let key in database) {
    if (inputEmail === database[key].email){
      return database[key].id;
    }
  }
};


const userLookUp = (emailLookUp,passwordLookUp, database) => {
  return Object.keys(database).find((user) => {
    if(database[user].email != emailLookUp || database[user].password != passwordLookUp) {
      return false;
    } else {
      return true;
    }
  })
};

const urlsForUser = (id) => {
  const tempObj = {};
  if (id) {
    for (let shortURL in urlDatabase) {
      if(urlDatabase[shortURL].userID === id.id) {
        tempObj[shortURL] = urlDatabase[shortURL];
      }
    }
  }
  return tempObj;
};

const generateRandomString = () => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghejklmnopqrstuvwxyz1234567890';
  //// result 6 random characters. 
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return randomString;
};

module.exports = {urlDatabase, emailLookUp, users, generateRandomString, urlsForUser, userLookUp, passwordLookUp, getUserByEmail};