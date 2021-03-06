const express = require("express");
const dotenv = require("dotenv");
const errorMiddleware = require('./middleware/errorMiddleware')
const todosRoute = require("./routes/todosRoute");
const db = require("./db");
const path = require('path')
const fs = require('fs')


dotenv.config();

db.query(
  "CREATE TABLE todos(id BIGSERIAL NOT NULL PRIMARY KEY, login VARCHAR(50) NOT NULL, password VARCHAR(1000) NOT NULL, todos JSON)"
)
  .then(res => console.log('Table is created'))
  .catch(e => {
    if (e.code === "42P07") {
      console.log('Table is ready')
    } else {
      console.error(e);
    }
  });

const app = express();

app.use(express.json());

app.use("/api/todos", todosRoute);

app.use(errorMiddleware);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build', 'index.html')))
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
