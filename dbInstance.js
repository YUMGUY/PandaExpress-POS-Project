/**
 * Database Module - creates a secure connection to the database and exports it.
 * @module dbInstance
 * 
 */

const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

let usernameDB = process.env.USERNAMEDB;
let password = process.env.PASSWORD;
let database = process.env.DATABASE;
let server = process.env.HOST;
let port = process.env.DB_PORT;
let databaseName = process.env.DATABASENAME;
const connectionString = `postgresql://${usernameDB}:${password}@${database}.${server}:${port}/${databaseName}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

/**
 * Exports a connection to our database named pool
 * 
 */
module.exports = {pool};

