const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : String
});

const exerciseSchema = new mongoose.Schema({
    userId : String,
    username : String,
    date : String,
    duration : Number,
    description : String
});

var userModel = mongoose.model("userModel", userSchema);

var exerciseModel = mongoose.model("exerciseModel", exerciseSchema);

module.exports = {
    userModel : userModel,
    exerciseModel : exerciseModel
}