const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// It allows to read the environment variables from the config.env file
dotenv.config({ path: './config.env' });
const app = require('./app');

// Stores all the DB information and replace the '<PASSWORD>' with the real password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Start the connection with the database in Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB conecction successful'));

// Select a port
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
  console.log(`Running on port ${port}...`);
  console.log(process.env.NODE_ENV);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  // console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
