'use strict';

var express = require('express');
var router = express.Router();

//for upload
var uploadcek = require('../config/upload')
var upload = uploadcek.destination('public/uploads/beforeconvert')

const files = require('../controllers/filesController');
// const verify = require('../middleware/verify');

/* GET users listing. */
// router.get('/', user.users);
router.post('/ApiConvertPostApi', upload.fields([{ name: 'files_convert', maxCount: 1 },]), files.convertFilesApi);

module.exports = router;