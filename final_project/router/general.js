const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(300).json({message: "User successfully registered"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   const bookList = books;
//   return res.status(300).json({message: bookList});
// });

public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('/'); 
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching book list:", error.message);
      return res.status(500).json({ message: "Failed to fetch book list." });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   return res.status(300).json({message: books[isbn]});
//  });

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    new Promise((resolve, reject) => {
      resolve(books[isbn]); 
    })
    .then((book) => {
      return res.status(200).json({ message: book });
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});
  
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//     const author = req.params.author;
//     const keys = Object.keys(books);
//     const booksByAuthor = [];

//     for (let key of keys) {
//         if (books[key].author.toLowerCase() === author.toLowerCase()) {
//             booksByAuthor.push(books[key]);
//         }
//     }

//   return res.status(300).json({message: booksByAuthor});
// });
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    new Promise((resolve) => {
      const keys = Object.keys(books);
      const booksByAuthor = [];
  
      for (let key of keys) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      }
  
      resolve(booksByAuthor); 
    })
    .then((booksByAuthor) => {
      return res.status(200).json({ message: booksByAuthor });
    });
});
  

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//     const title = req.params.title;
//     const bookKeys = Object.keys(books);
//     let foundBook = null;

//     for (let key of bookKeys) {
//         if (books[key].title.toLowerCase() === title.toLowerCase()) {
//           foundBook = books[key];
//           break;
//         }
//     }
//   return res.status(300).json({message: foundBook});
// });

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    new Promise((resolve) => {
      const bookKeys = Object.keys(books);
      let foundBook = null;
  
      for (let key of bookKeys) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          foundBook = books[key];
          break;
        }
      }
  
      resolve(foundBook);
    })
    .then((foundBook) => {
      return res.status(200).json({ message: foundBook });
    });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = {review:books[isbn].reviews}
  return res.status(300).json({message: review});
});

module.exports.general = public_users;
