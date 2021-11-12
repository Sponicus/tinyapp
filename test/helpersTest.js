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
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it("should return undefined with an invalid email", () => {
    const user = getUserByEmail("ramdom@example.com", testUsers)
    const expectedUserID = undefined; //"ramdom@example.com";
    assert.equal(user, expectedUserID);
  });

  it ("should return a user with valid email", () => {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = "user2RandomID";
    assert.equal(user, expectedUserID)    
  });

  it("should return undefined with no user email", () => {
    const user = getUserByEmail("",testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  })

  it("should return undefined with a number", () =>{
    const user = getUserByEmail(54235, testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  })

  it("should return undefined with null", () =>{
    const user = getUserByEmail(null, testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  })

  it("should return undefined with boolean", () =>{
    const user = getUserByEmail(true, testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  })
});

// console.log(getUserByEmail("ramdom@example.com", testUsers))