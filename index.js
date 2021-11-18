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
    prompt();
});
//PROMPT DATA ------------------------------------------------------------------------
const promptOptions = {
    allEmps: "View All Employees",
    allEmpsByDep: "View All Employees by Department",
    allEmpsByManager: "View All Employees by Manager",
    addEmp: "Add an Employee",
    updateEmpRole: "Update an Employee's Role",
    removeEmp: "Remove an Employee",
    updateEmpsManager: "Update an Employee's Manager",
    viewAllRoles: "View All Roles",
};
// PROMPT FUNCTION -------------------------------------------------------------------
function prompt() {
    inquirer
        .prompt({
            name: "promptSelection",
            type: "list",
            message: "Hello. What would you like to do?",
            choices: [
                promptOptions.allEmps,
                promptOptions.allEmpsByDep,
                promptOptions.allEmpsByManager,
                promptOptions.addEmp,
                promptOptions.updateEmpRole,
                promptOptions.removeEmp,
                promptOptions.updateEmpsManager,
                promptOptions.viewAllRoles,
            ],
        })
        .then((choice) => {
            console.log("You Chose ", choice);
            switch (choice.promptSelection) {
                case promptOptions.allEmps:
                    console.log('1');
                    break;
                case promptOptions.allEmpsByDep:
                    console.log('2');
                    break;
                case promptOptions.allEmpsByManager:
                    console.log('3');
                    break;
                case promptOptions.addEmp:
                    console.log('4');
                    break;
                case promptOptions.updateEmpRole:
                    console.log('5');
                    break;
                case promptOptions.removeEmp:
                    console.log('6');
                    break;
                case promptOptions.viewAllRoles:
                    console.log('7');
                    break;
            }
        });
}

