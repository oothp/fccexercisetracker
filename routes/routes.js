const express = require('express')
const router = express.Router()
const controller = require('../controllers/main')

router.get('/api/users', controller.getUsers)
router.get('/api/users/:_id/logs', controller.getLogs)

router.post('/api/users', controller.newUser)
router.post('/api/users/:_id/exercises', controller.addExercise)

router.get('/', controller.getHome)

module.exports = router