const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    //Write your code here
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (isbn in books) {
    res.send(books[isbn]);
  } else {
    res.send("Book not found");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  // Loop through each book object
  for (let bookId in books) {
    // Check if the author matches the requested author
    if (books[bookId].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[bookId]);
    }
  }

  // Return the matching books as a response
  res.json(matchingBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book = Object.values(books).find((book) => book.title === title);
  if (book) {
    res.json(book);
  } else {
    res.json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.send(book.reviews);
  } else {
    return res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
