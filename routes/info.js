const express = require('express')
const router = express.Router();
const userController = require("../controller/info");
const { checkToken } = require('../middlewares/middleware');


router.post('/sign-up', userController.signUp);

router.post('/login',userController.login)

router.get('/all-users',checkToken,userController.allUsers)

router.get('/profile', checkToken, userController.getProfile)

module.exports = router;