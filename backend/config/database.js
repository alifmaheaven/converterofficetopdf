require('dotenv').config()

var database = require('pg')
var types = database.types
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});

const { Pool } = database

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
})

pool.connect( function(err){
    if (err) throw err;
})

module.exports = { pool }
