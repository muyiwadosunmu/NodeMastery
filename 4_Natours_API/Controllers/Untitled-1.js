//import express
const express = require('express');
//import body-parser
const bodyParser = require('body-parser');
//import bcrypt for password hashing
const bcrypt = require('bcrypt');

//create an express app
const app = express();

//use body-parser middleware to parse json data from request body
app.use(bodyParser.json());

//update user password route handler function
app.put('/updatePassword', (req, res) => {
  //get the new password from request body
  const { newPassword } = req.body;

  //check if user is logged in
  if (req.user) {
    //hash the new password using bcrypt
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    //update the user's password with the hashed version in the database

    User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      (err, updatedUser) => {
        if (err) {
          return res.status(500).send({ message: 'Error updating user' });
        }
        return res.status(200).send({ message: 'User updated successfully' });
      }
    );
  } else {
    //if user is not logged in send error response

    return res.status(401).send({ message: 'Unauthorized access' });
  }
});
