'use strict';

var express = require('express');
var router = express.Router();

const user = require('../controllers/userControllers');
const verify = require('../middleware/verify');

/* GET users listing. */
// router.get('/', user.users);
router.post('/login', user.loginUser);
router.put('/changepasswordlogin', verify.verifyToken, user.changePasswordLogin)
router.post('/sendrequestforget', user.sendRequestForget);
router.put('/changepassword', user.changePassword);

router.post('/accesslog', verify.verifyToken, user.accessLog);
router.get('/accesslog', verify.verifyToken, user.accessLogGet);

router.get('/getuser', verify.verifyToken, user.getUser);
router.get('/getuserall', verify.verifyToken, user.getUserAll);
router.put('/updateuser', verify.verifyToken, user.updateUsers);
router.post('/registeruser', user.createUsers);

router.get('/getallrole', verify.verifyToken, user.getallrole);

module.exports = router;