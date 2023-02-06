const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// require('dotenv').config({ path: './config' });
const PORT = process.env.PORT || 3000;
const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env);
// Server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}....`);
});
