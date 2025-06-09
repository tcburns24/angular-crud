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
  database: "insurance_quotes",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ connected to MySQL!");
});

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
