const fs = require('node:fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModels');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config();
// require('dotenv').config({ path: './config' });

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE;
mongoose
  .set('strictQuery', false)
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`DB Conection Successfull`))
  .catch((err) => console.log(err));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
// IMPORT DATA
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); // WSo as to allow user creation
    await Review.create(reviews);
    console.log(`Data Successfully loaded on ${PORT}`);
  } catch (error) {
    console.error(error);
  }
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Successfully deleted');
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

console.log(process.argv);

// node ./dev-data/data/importDevData.js --delete
// node ./dev-data/data/importDevData.js --import
