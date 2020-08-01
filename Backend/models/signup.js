const mongoose = require('mongoose');

const signupModel = mongoose.Schema({

    img: { data: Buffer, contentType: String },
    firstName : { type : String }, 
    lastName : { type : String},
    userName : { type : String },
    password : { type : String },
    incomingRequests : [String],
    sentRequests : [String],
    friend : [String]
});

module.exports = mongoose.model('Signup', signupModel);