const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it("should return undefined with an invalid email", () => {
    const user = getUserByEmail("ramdom@example.com", testUsers)
    console.log(user);
    const expectedUserID = undefined; //"ramdom@example.com";
    assert.equal(user, expectedUserID);
  });
});

// console.log(getUserByEmail("ramdom@example.com", testUsers))