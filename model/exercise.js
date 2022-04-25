const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: { type:String, default: new Date() },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Exercise = mongoose.model('Exercise', ExerciseSchema)
module.exports = Exercise