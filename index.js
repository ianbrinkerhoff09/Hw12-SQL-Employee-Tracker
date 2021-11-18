// DEPENDANCIES --------------------------------------------------------------------
require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");
// SQL CONNECTION -------------------------------------------------------------------
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    datebase: process.env.DB_NAME,
});
//SQL CONNECTION INITALIZATION -------------------------------------------------------
connection.connect((err) => {
    if (err) throw err;
    console.log(`Listening on port`);
});

function prompt(){
    
}

