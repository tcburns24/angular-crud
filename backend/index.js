const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// database configuration
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "taro",
  database: "athletic_director",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ connected to MySQL!");
});

// ===================== ATHLETES Endpoints =====================

// Endpoint: GET athletes
app.get("/api/athletes", (req, res) => {
  const sql = "select * from athletes";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("🚨 error on GET /athletes", err);
      return res.status(500).send("🚨 error on GET /athletes");
    }
    res.json(result);
  });
});

// Endpoint: POST a new athlete
app.post("/api/athletes", (req, res) => {
  const { first_name, last_name, class_year, gender } = req.body;

  if (!first_name || !last_name || !class_year || !gender) {
    return res.status(400).send("Missing athlete request body field(s)");
  }

  const sql = `insert into athletes (first_name, last_name, class_year, gender) values (?, ?, ?, ?)`;
  const values = [first_name, last_name, class_year, gender];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("🚨 error on POST /athletes", err);
      return res.status(500).send("db error");
    }
    res.status(201).send({
      message: "✅ Athlete successfully POSTed",
      athleteId: result.insertId,
    });
  });
});

// Endpoint: PUT an existing athlete
app.put("/api/athletes/:id", (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, class_year, gender } = req.body;

  const sql = `update athletes set
                first_name = ?,
                last_name = ?,
                class_year = ?,
                gender = ?
              where athlete_id = ?`;
  const values = [first_name, last_name, class_year, gender, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("🚨 error on PUT /athletes/:id", err);
      return res.status(500).send("db error");
    }
    res.send({ message: "Athlete successfully updated ✅" });
  });
});

// Endpoint: PATCH a field of an existing athlete
app.patch("/api/athletes/:id", (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).send("No fields to update.");
  }

  const setClause = Object.keys(fields)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(fields), id];

  const sql = `UPDATE athletes SET ${setClause} WHERE athlete_id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error partially updating athlete:", err);
      return res.status(500).send("DB error");
    }
    res.send({ message: "Athlete partially updated ✅" });
  });
});

// ===================== EMPLOYEES Endpoints =====================

// Endpoint: POST a new employee
app.post("/api/employees", (req, res) => {
  const { name, email, hometown, luckynumber, department, notes } = req.body;
  const sql =
    "INSERT INTO employees (name, email, hometown, luckynumber, department, notes) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, email, hometown, luckynumber, department, notes],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "employee added", employeeId: result.insertId });
    }
  );
});

// ENDPOINT: GET all employees
app.get("/api/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Endpoint: Delete an employee (by ID)
app.delete("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({
      message: "Employee deleted",
      affectedRows: result.affectedRows,
    });
  });
});

// Endpoint: Delete multiple employees in bulk
app.post("/api/employees/bulk-delete", (req, res) => {
  const ids = req.body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(500).send({ error: "You didn't provide any IDs" });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `DELETE FROM employees WHERE id IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({
      message: "All those employees are toast!🍞",
      affectedRows: result.affectedRows,
    });
  });
});

// Endpoint: PUT (update) an employee
app.put("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, hometown, luckynumber, department, notes } = req.body;
  const sql = `
    UPDATE employees SET
      name = ?,
      email = ?,
      hometown = ?,
      luckynumber = ?,
      department = ?,
      notes = ?
    WHERE id = ?
  `;
  const values = [name, email, hometown, luckynumber, department, notes, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating employee: ", err);
      return res.status(500).send("DB error");
    }
    res.send({ message: "Employee PUT'd successfully ✅" });
  });
});

// Endpoint: GET stats
app.get("/api/employees/analytics", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      AVG(luckynumber) AS averageLuckyNumber,
      department,
      COUNT(department) AS departmentCount
    FROM employees
    GROUP BY department
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("couldn't pull up the stats: ", err);
      return res.status(500).send("DB error (/stats)");
    }
    res.json(results);
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
