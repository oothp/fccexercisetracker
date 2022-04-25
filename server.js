const mongoose = require("mongoose")
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const routes = require('./routes/routes')

// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html')
// });

app.use('/', routes)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + listener.address().port)
})

//establish connection to database
mongoose.connect(process.env.MONGO_URI, {}, (err) => {
  if (err) {
      return console.log("Error: ", err)
  } else {
      console.log(
          "MongoDB Connection -- Ready state is:",
          mongoose.connection.readyState)
  }
});