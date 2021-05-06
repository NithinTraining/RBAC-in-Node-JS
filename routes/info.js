const express = require('express')
const router = express.Router();
const userController = require("../controller/info");
const adminController = require("../controller/admin");
const ck = require('../middlewares/middleware');



router.post('/sign-up', userController.signUp);

router.post('/login',userController.login)

router.get('/all-users',checkToken,ck.checkpermi,userController.allUsers)

router.get('/profile', checkToken,ck.checkpermi, userController.getProfile)

router.post('/superAdminSeed', adminController.createSuperAdmin)

router.post('/createRole' , checkToken,ck.isSAdmin, adminController.createRole)

router.get('/listPermissions', checkToken, ck.checkpermi,adminController.listPermissions)

// router.post()
module.exports = router;
