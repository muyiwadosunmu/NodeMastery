const dotenv = require('dotenv');

dotenv.config();
// require('dotenv').config({ path: './config' });
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = require('./app');

const DB = process.env.DATABASE;
mongoose
  .set('strictQuery', false)
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`DB Conection Successfull`));
// console.log(app.get('env'));
// console.log(process.env);
// Server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}....`);
});
