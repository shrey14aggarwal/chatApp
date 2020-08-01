const mongoose = require('mongoose');

const userModel = mongoose.Schema({

    userName : { type : String }, 
    password : { type : String},
});

module.exports = mongoose.model('Users', userModel);