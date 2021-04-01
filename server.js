const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { userModel, exerciseModel } = require('./model');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', async (req, res) => {
  let newUser = await userModel.findOne({ username: req.body.username });
  console.log(newUser);
  if (newUser == null) {
    let newUser = await userModel.create({
      username: req.body.username
    });
    return res.json({
      _id: newUser._id,
      username: newUser.username
    });
  } else {
    return res.json("Username already exists");
  }
});

app.post('/api/exercise/add', async (req, res) => {
  const findUser = await userModel.findOne({ _id: req.body.userId });
  if (findUser == null) {
    return res.json("Username not found");
  } else {
    let newExercise = await exerciseModel.create({
      userId: findUser._id,
      username: findUser.username,
      date: req.body.date,
      duration: req.body.duration,
      description: req.body.description
    });
    return res.json({
      _id: newExercise.userId,
      username: newExercise.username,
      date: new Date(newExercise.date).toDateString(),
      duration: newExercise.duration,
      description: newExercise.description
    });
  }
});

app.get('/api/exercise/users', async (req, res) => {
  let usersAll = await userModel.find({}).select({ __v: 0 });
  console.log(usersAll);
  res.json(usersAll);
});

app.get('/api/exercise/log', async (req, res) => {
  const { userId, from, to, limit } = req.query;
  
  var temp = { userId : userId };
  
  if (from) {
    temp = {
      userId: userId,
      $gte: from
    }
  }
  if (to) {
    temp = {
      userId: userId,
      $gte: from,
      $lt: to
    }
  }

  var allExercise;
  if (limit) {
    var allExercise = await exerciseModel.find(temp)
      .select({ _id: 0, userId: 0, username: 0, __v: 0 })
      .sort({ date: 1 })
      .limit(Number(limit));
  } else {
    var allExercise = await exerciseModel.find({ userId: userId })
      .select({ _id: 0, userId: 0, username: 0, __v: 0 })
      .sort({ date: 1 });
  }

  const user = await userModel.findOne({ _id : userId});

  for (const key in allExercise) {
    let a = allExercise[key].date;
    allExercise[key].date = new Date(`${a}`).toDateString();
    console.log(allExercise[key].date)
  }

  const result = {
    _id: userId, 
    username: user.username, 
    count: allExercise.length, 
    log: allExercise
  }
  res.json(result);

});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const listener = app.listen(process.env.PORT || 4000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// {"_id":"60631bb0e56d570f64cbb104","username":"rohit"}