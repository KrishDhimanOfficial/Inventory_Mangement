import express from 'express'
const router = express.Router()
import users_controllers from '../controllers/users.controller.js'

router.post('/register/user',users_controllers.registerUserwithEmail)
router.route('/user/:id?')
    .post(users_controllers.createUser)
    .get(users_controllers.getSingleUser)
    .put(users_controllers.updateUserDetails)
    .delete(users_controllers.deleteUserDetails)

export default router