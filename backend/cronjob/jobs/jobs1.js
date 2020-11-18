'use strict';

require('dotenv').config()
let environment = process.env;

var response = require('../../config/res');
var { pool } = require('../../config/database');

var mailConfig = require('../../config/email');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

const fs = require('fs')
const toPdf = require("office-to-pdf")
const path = require('path');

var SCREET_KEY = process.env.SCREET_KEY;
var EXPIRED_TOKEN = parseInt(process.env.EXPIRED_TOKEN);

// agar sepuluh baris maka kita gunakan salt dan pake async ya :)
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const async = require('async');

exports.deleteFiles = async function(req, res) {
    var directoryFilesBefore = path.join(__dirname, `./../../public/uploads/beforeconvert`)
    var directoryFilesAfter = path.join(__dirname, `./../../public/uploads/afterconvert`)
    async.waterfall([
        function(callback) {
            try {
                fs.readdir(directoryFilesBefore, (err, files) => {
                    if (files.length > 0) {
                        files.forEach(file => {
                            if ((parseInt(file.split("_")[1]) + (3 * 60 * 1000)) <= parseInt(new Date().getTime())) {
                                fs.unlink(directoryFilesBefore+'/'+file, (err) => {
                                    console.log('success delete ' + directoryFilesAfter+'/'+file);
                                });
                            }   
                        });
                    } 
                });
            } catch (e) {
                callback(e)
            } finally{
                callback(null)
            }
        },
        function(callback) {
            try {
                fs.readdir(directoryFilesAfter, (err, files) => {
                    if (files.length > 0) {
                        files.forEach(file => {
                            if ((parseInt(file.split("_")[1]) + (3 * 60 * 1000)) <= parseInt(new Date().getTime())) {
                                fs.unlink(directoryFilesAfter+'/'+file, (err) => {
                                    
                                    console.log('success delete ' + directoryFilesAfter+'/'+file);
                                });
                            }   
                        });
                    }
                });
            } catch (e) {
                callback(e)
            } finally{
                callback(null)
            }
        },
        ], function(err, result) {
            // console.log(err);
            // you can add anything you want
        });

}