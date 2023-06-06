const dotenv = require('dotenv');

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION, Server is shutting Down`);
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});
// require('dotenv').config({ path: './config' });
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = require('./app');

const DB = process.env.DATABASE;
mongoose
  .set('strictQuery', false)
  .connect(DB, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Conection Successfull`))
  .catch((err) => console.log(`Error:`, err));
// console.log(app.get('env'));
// console.log(process.env);
// Server

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}....`);
});

// Unhandled Rejections in our App
process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION, Server is shutting Down`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
