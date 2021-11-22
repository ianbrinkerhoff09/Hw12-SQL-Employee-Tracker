// DEPENDANCIES --------------------------------------------------------------------
require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
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
    allDep: "View All Departments",
    allRoles: "View All Roles",
    allEmps: "View All Employees",
    addDep: "Add a new Department",
    addRole: "Add a new Role",
    addEmp: "Add an Employee",
    updateEmpRole: "Update an Employee's Role",
};
// PROMPT FUNCTION -------------------------------------------------------------------
function prompt() {
    inquirer
        .prompt({
            name: "promptSelection",
            type: "list",
            message: "Hello. What would you like to do?",
            choices: [
                promptOptions.allDep,
                promptOptions.allRoles,
                promptOptions.allEmps,
                promptOptions.addDep,
                promptOptions.addRole,
                promptOptions.addEmp,
                promptOptions.updateEmpRole,
            ],
        })
        .then((choice) => {
            console.log("You Chose ", choice);
            switch (choice.promptSelection) {
                case promptOptions.allDep:
                    viewDepsData();
                    break;
                case promptOptions.allRoles:
                    viewRoleData();
                    break;
                case promptOptions.allEmps:
                    viewEmpData();
                    break;
                case promptOptions.addDep:
                    addDep();
                    break;
                case promptOptions.addRole:
                    addRole();
                    break;
                case promptOptions.addEmp:
                    addEmp();
                    break;
                case promptOptions.updateEmpRole:
                    console.log("7");
                    break;
            }
        });
}
//VIEW EMPLOYEE DATA FUNCTION --------------------------------------------------------
function viewEmpData() {
    const query = `SELECT company_db.employees.id AS "ID", 
    company_db.employees.first_name AS "First Name", 
    company_db.employees.last_name AS "Last Name", 
    company_db.roles.title AS "Title", 
    company_db.roles.salary AS "Salary", 
    company_db.departments.department_name "Department",
    CONCAT(company_db.manager.first_name, ' ', company_db.manager.last_name) AS "Manager"
    FROM company_db.employees 
    JOIN company_db.roles ON company_db.employees.role_id=roles.id
    JOIN company_db.departments ON company_db.roles.department_id=departments.id
    LEFT JOIN company_db.employees manager ON company_db.manager.id = employees.manager_id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log(" ALL EMPLOYEES");
        console.table(res);
    });
    setTimeout(prompt, 1000);
}
// VIEW DEPARTMENTS DATA FUNCTION
function viewDepsData() {
    const query = `SELECT * FROM company_db.departments`;
    connection.query(query, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("\n");
            console.table(res);
            console.log("\n");
        }
    });
    setTimeout(prompt, 1000);
}
// VIEW ROLES DATA FUNCTION
function viewRoleData() {
    const query = `SELECT company_db.roles.id AS ID, company_db.roles.title AS Title, company_db.roles.salary AS Salary, company_db.departments.department_name AS Department FROM company_db.roles
    JOIN company_db.departments ON company_db.roles.department_id=departments.id`;
    connection.query(query, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("\n");
            console.table(res);
            console.log("\n");
        }
    });
    setTimeout(prompt, 1000);
}
// CREATE NEW EMPLOYEE
async function addEmp() {
    function promptNameInput() {
        return [
            {
                name: "first",
                type: "input",
                message: "Please enter the employee's first name: ",
            },
            {
                name: "last",
                type: "input",
                message: "Please enter the employee's last name: ",
            },
        ];
    }
    const addEmpName = await inquirer.prompt(promptNameInput());
    connection.query(
        `SELECT company_db.roles.id, company_db.roles.title FROM company_db.roles ORDER BY company_db.roles.id;`,
        async (err, res) => {
            if (err) throw err;
            const { role } = await inquirer.prompt([
                {
                    name: "role",
                    type: "list",
                    choices: () => res.map((res) => res.title),
                    message: "What is the employee role?",
                },
            ]);
            let role_id;
            for (const row of res) {
                if (row.title === role) {
                    role_id = row.id;
                    continue;
                }
            }
            connection.query(
                `SELECT * FROM company_db.employees`,
                async (err, res) => {
                    if (err) throw err;
                    let choices = res.map(
                        (res) => `${res.first_name} ${res.last_name}`
                    );
                    choices.push("none");
                    let { manager } = await inquirer.prompt([
                        {
                            name: "manager",
                            type: "list",
                            choices: choices,
                            message: "Please select their manager:",
                        },
                    ]);
                    let manager_id;
                    let manager_name;
                    if (manager === "none") {
                        manager_id = null;
                    } else {
                        for (const data of res) {
                            data.fullName = `${data.first_name} ${data.last_name}`;
                            if (data.fullName === manager) {
                                manager_id = data.id;
                                manager_name = data.fullName;
                                console.log(manager_id);
                                console.log(manager_name);
                                continue;
                            }
                        }
                    }
                    console.log("New employee added.");
                    connection.query(
                        `INSERT INTO company_db.employees SET ?`,
                        {
                            first_name: addEmpName.first,
                            last_name: addEmpName.last,
                            role_id: role_id,
                            manager_id: manager_id,
                        },
                        (err, res) => {
                            if (err) throw err;
                            setTimeout(prompt, 1000);
                        }
                    );
                }
            );
        }
    );
}
// ADD NEW DEPARTMENT
async function addDep() {
    function getDepName() {
        return [
            {
                name: "depName",
                type: "input",
                message: "What would you like to name the new Department?",
            },
        ];
    }
    const addDepName = await inquirer.prompt(getDepName());
    connection.query(
        `SELECT company_db.departments.id, company_db.departments.department_name FROM company_db.departments ORDER BY company_db.departments.id;`,
        async (err, res) => {
            if (err) throw err;

            console.log("New department added to database.");
            connection.query(
                `INSERT INTO company_db.departments SET ?`,
                {
                    id: addDepName.department_id,
                    department_name: addDepName.depName,
                },
                (err, res) => {
                    if (err) throw err;
                    setTimeout(prompt, 1000);
                }
            );
        }
    );
}
async function addRole() {
    function getRoleName() {
        return [
            {
                name: "rolesName",
                type: "input",
                message: "What would you like to name the new Role?",
            },
            {
                name: "rolesSalary",
                type: "input",
                message: `What is the salary?`,
                max: 7,
                numeric: true,
            },

            {
                name: "rolesDepartment",
                type: "list",
                choices: ("Management", "Sales", "Logistics", "Support"),
                message: `What is department will the new role belong to?`,
            },
        ];
    }

    const addRolesName = await inquirer.prompt(getRoleName());
    connection.query(
        `SELECT company_db.roles.id, company_db.roles.title, company_db.department.department_name FROM company_db.roles, company_db.departments ORDER BY company_db.roles.id;`,
        async (err, res) => {
            if (err) throw err;
            console.log("New Role added to database.");
            connection.query(
                `INSERT INTO company_db.roles SET ?`,
                {
                    id: addRolesName.roles_id,
                    title: addRolesName.rolesName,
                    salary: addRolesName.rolesSalary,
                    department_id: addRolesName.rolesDepartment,
                },
                (err, res) => {
                    if (err) throw err;
                    setTimeout(prompt, 1000);
                }
            );
        }
    );
}
