const app = require('./app');

// Server
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}....`);
});
