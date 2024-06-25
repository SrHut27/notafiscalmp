const {Client} = require("pg");
require("dotenv").config()

const connection = new Client ({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: 5432,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
})

module.exports = connection;