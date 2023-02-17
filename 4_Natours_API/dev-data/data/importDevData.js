const fs = require('node:fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModels');

dotenv.config();
// require('dotenv').config({ path: './config' });

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE;
mongoose
  .set('strictQuery', false)
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`DB Conection Successfull}`))
  .catch((err) => console.log(err));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
// IMPORT DATA
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded');
  } catch (error) {
    console.error(error);
  }
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully deleted');
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

console.log(process.argv);
