'use strict';

require('dotenv').config()

var response = require('../config/res');
var { pool } = require('../config/database');

var mailConfig = require('../config/email');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
var localFormat = 'YYYY-MM-DD HH:mm:ss';

var SCREET_KEY = process.env.SCREET_KEY;
var EXPIRED_TOKEN = parseInt(process.env.EXPIRED_TOKEN);

// agar sepuluh baris maka kita gunakan salt dan pake async ya :)
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const async = require('async');
exports.getUser = async function(req, res) {
    jwt.verify(req.token, SCREET_KEY, (err, authData) => {
        if (err) {
            response.bad("Token Expired",null, res);
        } else {
            response.ok('You are Login',authData, res)
        }
    } )
};

exports.getUserAll = async function(req, res) {
    var id = req.query.id_user;
    
    var sql =  'SELECT p_user.*, p_userrole.userrole_name  FROM p_user LEFT JOIN p_userrole ON p_user.id_userrole = p_userrole.id_userrole ORDER BY user_email ASC';
    if (id) {
        sql += ' WHERE id_user = '+id
    }
    pool.query(sql,
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
        } else{
            if (result.rows.length > 0) {
                if (id) {
                    response.ok("Success",result.rows[0], res)
                } else {
                    response.ok("Success",result.rows, res)
                }
            } else {
                response.bad('No data inside',null, res)
            }
        }  
    });
};

exports.createUsers = async function(req, res) {
    var email = req.body.email
    var username =  req.body.username
    var password = Math.random().toString(36).substring(5);
    var nama_petugas = req.body.nama_petugas
    var id_level = req.body.id_level
    var is_active = 1
    var first_login = 1;
    var salt = await bcrypt.genSalt(10);
    var url = req.body.url;
    var passwordAfterEncript = await bcrypt.hash(password, salt);

    async.waterfall([
        function(callback) {
            pool.query(`SELECT * FROM petugas WHERE email = $1`,
            [email],
            function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database!",null, res)
                    callback(err);
                } else {
                    if (result.rows.length > 0) {
                        response.bad('Email already exist',null, res)
                        callback(result.rows);
                    } else {
                        callback(null);
                    }
                }
            })
        },
        function(callback) {
            pool.query(`INSERT INTO petugas (id_petugas, email, username, password, nama_petugas, id_level, is_active, first_login) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [uuidv4(), email, username, passwordAfterEncript, nama_petugas, id_level, is_active, first_login], 
            function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database!",null, res)
                    callback(err);
                } else {                 
                    callback(null);
                }
            });
        },
        function(callback) {
            mailConfig.email.send({
                template: 'confirmationEmail',
                message: {
                    from: 'Support Dynamic <noreply-dynamic@sigma.my.id>',
                    to: email,
                },
                locals: {
                    subject: 'Verify User',
                    name: username,
                    email: email,
                    password: password,
                    selfUrl: url
                }
            })
            .then((result) => {
                console.log('send');
                response.ok("Data has been successfully saved!",null, res)
                callback(null);
            })
            .catch((err) => {
                console.log(err); 
                response.bad("Email Not send!",null, res)
                callback(err);
            });
        }
        ], function(err, result) {
            // you can add anything you want
        });

}
   
exports.loginUser = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var isMatch;

    async.waterfall([
        function(callback) {
            pool.query('SELECT * FROM petugas LEFT JOIN level ON petugas.id_level = level.id_level WHERE email = $1 AND petugas.is_active = 1', [email],
            function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database",null, res)
                    callback(err);
                } else{
                    if (result.rows.length > 0) {
                        callback(null, result.rows[0]);
                    } else {
                        response.bad('Email not registered',null, res)
                        callback(result);
                    }
                }
            });
        },
        async function(userData, callback) {
            isMatch = await bcrypt.compare( password, userData.password);
            if (isMatch) {
                jwt.sign(userData, SCREET_KEY,{expiresIn: EXPIRED_TOKEN},(err, token) => {
                    userData.token = token
                    response.ok("Login Success",userData, res)
                    callback(null);
               })
            } else {
                response.bad('Username or password is incorrect',null, res)
                callback('null');
            }
        },
      ], function(err, result) {
        // you can add anything you want
      });
};

exports.updateUsers = async function(req, res) {
    var email = req.body.email
    var username =  req.body.username
    var nama_petugas = req.body.nama_petugas
    var id_level = req.body.id_level
    var is_active = 1
    var first_login = 0;
    var id_petugas =  req.body.id_petugas;

    async.waterfall([
        function(callback) {
            pool.query(`SELECT * FROM petugas WHERE email = $1 AND id_petugas <> '${id_petugas}'`,
            [email],
            function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database!",null, res)
                    callback(err);
                } else {
                    if (result.rows.length > 0) {
                        response.bad('Email already exist',null, res)
                        callback(result.rows);
                    } else {
                        callback(null);
                    }
                }
            })
        },
        function(callback) {
            pool.query(`UPDATE petugas SET email = $1, username = $2, nama_petugas = $3, id_level = $4, is_active = $5, first_login = $6 WHERE id_petugas = $7`,
            [email, username, nama_petugas, id_level, is_active, first_login, id_petugas], 
            function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database!",null, res)
                    callback(err);
                } else {                 
                    callback(null);
                }
            });
        },
        ], function(err, result) {
            // you can add anything you want
        });
}

exports.changePasswordLogin = async function(req, res) {
    var id = req.body.id_user;
    var newpassword = req.body.user_password;

    var salt = await bcrypt.genSalt(10);
    newpassword = await bcrypt.hash(newpassword, salt)

    pool.query('UPDATE p_user SET user_password = $1, first_login = 0 WHERE id_user = $2',
    [newpassword, id],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
        } else{
            var sql =  'SELECT * FROM p_user LEFT JOIN p_userrole ON p_user.id_userrole = p_userrole.id_userrole WHERE id_user = '+id ;
            pool.query(sql,
            async function (err, result){
                if(err){
                    console.log(err)
                    response.bad("Error Database",null, res)
                } else{
                    jwt.sign(result.rows[0], SCREET_KEY,{expiresIn: EXPIRED_TOKEN},(err, token) => {
                        result.rows[0].token = token
                        var userData = result.rows[0];
                        response.ok("Reset password success!",userData, res)
                   })
                }  
            });
        }
    });
};


exports.sendRequestForget = async function(req, res) {
    var email = req.body.user_email;
    var url = req.body.url;
    var userData = {};
    if (email === null || email === undefined) {
        response.bad("Please insert email!",null, res)
        return
    }

    if (url === null || url === undefined) {
        response.bad("Please insert url for fogot password!",null, res)
        return
    }

    pool.query('SELECT * FROM p_user WHERE user_email = $1',
    [email,],
    async function (err, result){
        if(err){
            console.log(err)
            response.bad("Error Database",null, res)
            return
        } else{
            if (result.rows.length > 0) {
                userData = result.rows[0]
                    jwt.sign(userData, SCREET_KEY,{expiresIn: 60*60*2},(err, token) => {             
                        mailConfig.email.send({
                            template: 'resetPassword',
                            message: {
                                from: 'Support Dynamic <noreply-dynamic@sigma.my.id>',
                                to: email,
                            },
                            locals: {
                                subject: 'Reset Password',
                                token: token,
                                urlSelf:url+'?token='+token,
                                name:userData.user_name,
                            }
                        })
                        .then((result) => {
                            response.ok("Please check email box spam/junk folder to reset your password!",null, res)
                            return
                        })
                        .catch((err) => {
                            console.log(err); 
                            response.bad("Email Not send!",null, res)
                            return
                        });
                   })
                   
            } else {
                response.bad('Email not registered',null, res)
                return
            }

        }
    });
};

exports.changePassword = async function(req, res) {
    var token = req.body.token;
    var newpassword = req.body.user_password;
    var id;

    var salt = await bcrypt.genSalt(10);
    newpassword = await bcrypt.hash(newpassword, salt)

    await jwt.verify(token, SCREET_KEY, (err, result) => {
        if (err) {
            console.log(err);
            response.bad('Token Expired Please Re-Email again',null,res);
            return
        }
        id = result.id_user
        return id
    } )
    if (id) {
        pool.query('UPDATE p_user SET user_password = $1, first_login = 0 WHERE id_user = $2',
        [newpassword, id],
        async function (err, result){
            if(err){
                console.log(err)
                response.bad("Error Database",null, res)
            } else{
                response.ok("Reset password success!",result, res)
                return
            }
        });
    }
};

exports.getallrole = async function(req, res) {

    pool.query('SELECT * FROM p_userrole', 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Failed Adding Access Log",null, res)
        } else{
            response.ok("Success get all role!",result.rows, res)
        }
    });

};

exports.accessLog = async function(req, res) {
    var token = req.token;
    var url = req.body.url;
    var id;
    var datenow = String(moment(new Date()).format(localFormat));
    jwt.verify(token, SCREET_KEY, (err, result) => {
        if (err) {
            response.bad("Token Expired",null, res);
        } else {
            id = result.id_user
        }
    } )
    
    pool.query('INSERT INTO h_accesslog (id_user, access_url, access_date) values ($1,$2,$3)',
    [ id, url, datenow], 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Failed Adding Access Log",null, res)
        } else{
            response.ok("Data has been successfully saved!",null, res)
        }
    });

};

exports.accessLogGet = async function(req, res) {
    var query = 'SELECT * FROM h_accesslog '+
                'LEFT JOIN p_user ON h_accesslog.id_user = p_user.id_user '+
                'LEFT JOIN p_userrole ON p_user.id_userrole = p_userrole.id_userrole '+
                'ORDER BY access_date DESC '
    pool.query(query, 
    function (error, result){
        if(error){
            console.log(error)
            response.bad("Failed Get all access log",null, res)
        } else{
            response.ok("Success Get all access log",result.rows, res)
        }
    });

};
