'use strict';

require('dotenv').config()

const fs = require('fs')
const path = require('path');

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