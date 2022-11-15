
const express = require('express')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

const router = express.Router()

const { getAllUsers,getCurrentUser,updateUser,updateUserPassword,getSingleUser } = require('../controllers/userController')


router.route('/getAllUsers').get(authentication,authorization('admin'),getAllUsers)
router.route('/currentUser').get(authentication,getCurrentUser)
router.route('/updateUser').patch(authentication,updateUser)
router.route('/updateUserPassword').patch(authentication,updateUserPassword)
router.route('/:id').get(authentication,getSingleUser)

module.exports = router