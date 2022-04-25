const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true },
    // log: [{
    //     description: String,
    //     duration: Number,
    //     date: { type: Date } 
    // }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User