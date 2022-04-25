const dayjs = require('dayjs')

const Exercise = require('../model/exercise')
const User = require('../model/user')

const dateFormat = 'ddd MMM DD YYYY'

const newUser = (req, res) => {
    let user = new User({
        username: req.body.username
    })
    user.save((err, data) => {
        if (err) return console.error(err)

        res.send(user)
    })
}

const getUsers = (req, res) => {
    User.find({}, (err, data) => {
        if (err) return console.error(err)

        res.send(data)
    })
}

const addExercise = (req, res) => {

    let user_id = req.params._id

    let dateNoFormat = new Date(req.body.date).toDateString() != "Invalid Date" 
        ? new Date(req.body.date) 
        : new Date()

    // find username by iD
    User.findById(user_id, (err, user) => {
        if (err) return console.error('ERROR', err)

        if (user) {
            let exercise = new Exercise({
                description: req.body.description,
                duration: req.body.duration,
                date: dateNoFormat,
                user_id: user
            })
            
            exercise.save((err, data) => {
                if (err) console.error(err)

                res.send({
                    _id: user._id,
                    username: user.username,
                    description: exercise.description,
                    duration: exercise.duration,
                    date: dateNoFormat.toDateString()
                    // date: dayjs(data.date * 1000).format(dateFormat)
                })
            })
        }
    })
}

const getLogs = (req, res) => {
    let uid = req.params._id

    User.findById(uid, (err, user) => {
        if (err) return console.error('ERROR', err)

        Exercise.find({user_id: uid}, (err, exercises) => {
            if (err) return console.error(err)


            // sort by date
            exercises.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
                // convert to millis and compare?
            });

            let fromDate = new Date(req.query.from).getTime()
            let toDate = new Date(req.query.to).getTime()
            let limit = parseInt(req.query.limit)

            // both to and from entered
            if (!isNaN(fromDate) && !isNaN(toDate)) {
                buildResponse(exercises, limit, fromDate, toDate)

            } else if (isNaN(fromDate) || isNaN(toDate)) {
                if (isNaN(fromDate)) {
                    fromDate = new Date(exercises[0].date).getTime()
                }
                if (isNaN(toDate)) {
                    let idx = exercises.length - 1
                    toDate = new Date(exercises[idx].date).getTime()
                }
                buildResponse(exercises, limit, fromDate, toDate)

            } else {
                // no to and from entered, i think
                buildResponse(exercises, limit)
            }
        })

        function buildResponse(exercises, limit, fromD = NaN, toD = NaN) {
            if (!isNaN(fromD) && !isNaN(toD)) {
                let exerciseCollection = exercises
                exercises = []

                exerciseCollection.forEach(e => {
                    let dateInMillis = new Date(e.date).getTime()

                    if (dateInMillis >= fromD && dateInMillis <= toD) {
                        exercises.push(e)
                    }
                });
            }

            if (!isNaN(limit)) {
                exercises = exercises.slice(0, limit)
            }

            res.send({
                username: user.username,
                count: exercises.length,
                _id: uid,
                log: exercises.map(e => ({
                    description: e.description,
                    duration: e.duration,
                    date: new Date(e.date).toDateString(),
                }))
            })
        }
    })
}

const getHome = (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html')
}

module.exports = {
    newUser,
    getUsers,
    addExercise,
    getLogs,
    getHome
}