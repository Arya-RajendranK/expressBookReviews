const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
    return res.status(200).json({message:"User successfully logged in"});
    } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;
  
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty" });
    }
  
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({
            message: `Review added successfully`,
            isbn:isbn,
            user: username,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});
  
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ 
        message: `Review deleted successfully`,
        user:username,
        isbn:isbn
     });
    } else {
      return res.status(404).json({ 
        message: `No review found for ISBN ${isbn}` ,
        user:username
    });
    }
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
