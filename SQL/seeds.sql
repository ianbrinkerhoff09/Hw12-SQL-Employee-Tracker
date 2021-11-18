USE company_db;

INSERT INTO departments (department_name)
VALUES  ("Management"),
        ("Sales"),
        ("Logistics"),
        ("Support");

INSERT INTO roles (title, salary, department_id)  
VALUES  ("CEO", 2000000, 1),
        ("COO", 1500000, 1),
        ('Head of Sales', 125000, 2),
        ("Sales Associate", 100000, 2),
        ("Warehouse Manager", 75000, 3),
        ("Shipping Manager", 75000, 3),
        ("Customer Support", 75000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Ian", "Brinkerhoff", 1, null),
        ("John", "Doe", 2, 1),
        ("Oliver", "Bush", 3, 1),
        ("Erik", "Johnson", 4, 3),
        ("Michael", "Brinkman", 5, 2),
        ("William", "Coleman", 6, 2),
        ("Richard", "Paine", 7, 2),
        ("Shelby", "Ranger", 7, 3),
        ("Ryan", "Fraser", 7, 3)