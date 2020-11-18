'use strict';

require('dotenv').config()
let environment = process.env;

var response = require('../config/res');

const fs = require('fs')
const toPdf = require("office-to-pdf")
const path = require('path');

const async = require('async');

exports.convertFilesApi = async function(req, res) {
    var files_convert
    var inputPath
    var outputPath
    var wordBuffer
    var base64File
    var data = {
        base64FileEncode : null,
        linkFile : null,
        expired : 'every 3 minutes',
        notes : 'every 3 minutes your files gone'
    }

    try {
        inputPath = path.join(__dirname, `./../public/uploads/beforeconvert/${req.files.files_convert[0].filename}`);
        outputPath = path.join(__dirname, `./../public/uploads/afterconvert/${req.files.files_convert[0].filename}.pdf`)
    }
    catch (e) {
        console.log(e);
    }

    async.waterfall([
        function(callback) {
            wordBuffer = fs.readFileSync(inputPath)
            toPdf(wordBuffer).then(
                (pdfBuffer) => {
                    try {
                        fs.writeFileSync(outputPath, pdfBuffer)
                    } catch (e) {
                        callback(err);
                    } finally {
                        callback(null);
                    }
                }, (err) => {
                    callback(err);
                }
            )
        },
        async function(callback) {
            base64File = await fs.readFileSync(outputPath, {encoding: 'base64'});
            data.base64FileEncode = base64File;
            data.linkFile = `${environment.BASE_URL}/publicFiles/afterconvert/${req.files.files_convert[0].filename}.pdf`
            response.ok("Data has been successfully saved!",data, res)
        },
        ], function(err, result) {
            console.log(err);
            // you can add anything you want
        });

}