const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// database configuration
const db = mysql.createConnection({
  host: "sql5.freesqldatabase.com",
  user: "sql5784277",
  password: "ttNMTdYEx5",
  database: "sql5784277",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to FreeSQLDatabase MySQL!");
});

// ===================== 1) ATHLETES Endpoints =====================

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

// Endpoint: DELETE an athlete
app.delete("/api/athletes/:id", (req, res) => {
  const id = req.params.id;
  const sql = `delete from athletes where athlete_id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("🚨 error on DELETE /athletes/:id", err);
      return res.status(500).send("db error");
    }
    res.send({ message: "Athlete successfully deleted 🗑️" });
  });
});

// Endpoint: GET Fall, Winter, Spring sports for athlete
app.get("/api/athletes-with-sports", (req, res) => {
  const sql = `
    SELECT 
      a.athlete_id,
      a.first_name,
      a.last_name,
      a.class_year,
      a.gender,
      -- subqueries or left joins for each season:
      (SELECT s.sport_name
      FROM athlete_teams at
      JOIN teams t ON at.team_id = t.team_id
      JOIN sports s ON t.sport_id = s.sport_id
      WHERE at.athlete_id = a.athlete_id AND s.season = 'fall'
      LIMIT 1) AS fall_sport,

      (SELECT s.sport_name
      FROM athlete_teams at
      JOIN teams t ON at.team_id = t.team_id
      JOIN sports s ON t.sport_id = s.sport_id
      WHERE at.athlete_id = a.athlete_id AND s.season = 'winter'
      LIMIT 1) AS winter_sport,

      (SELECT s.sport_name
      FROM athlete_teams at
      JOIN teams t ON at.team_id = t.team_id
      JOIN sports s ON t.sport_id = s.sport_id
      WHERE at.athlete_id = a.athlete_id AND s.season = 'spring'
      LIMIT 1) AS spring_sport

    FROM athletes a;`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Error athletes-with-sports");
    res.json(result);
  });
});

// ===================== 2) TEAMS Endpoints =====================

// Endpoint: GET all teams
app.get("/api/teams", (req, res) => {
  const sql = "select * from teams";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Error fetching teams");
    res.json(result);
  });
});

// Endpoint: POST a new team
app.post("/api/teams/", (req, res) => {
  const { sport_id, level, gender, season, coach_name } = req.body;
  const sql =
    "insert into teams (sport_id, level, gender, season, coach_name) values (?, ?, ?, ?, ?)";
  const values = [sport_id, level, gender, season, coach_name];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send("Error POSTing team");
    res.json({ message: "Team added", teamId: result.insertId });
  });
});

// Endpoint: Update a team
app.put("/api/teams/:id", (req, res) => {
  const id = req.params.id;
  const { sport_id, level, gender, season, coach_name } = req.body;
  const sql = `
    UPDATE teams SET sport_id = ?, level = ?, gender = ?, season = ?, coach_name = ? 
    WHERE team_id = ?
  `;
  const values = [sport_id, level, gender, season, coach_name, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send("Error updating team");
    res.json({ message: "Team updated" });
  });
});

// Endpoint: DELETE a team
app.delete("/api/teams/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM teams WHERE team_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Error deleting team");
    res.json({ message: "Team deleted" });
  });
});

// ===================== 3) SPORTS Endpoints =====================
// GET all sports
app.get("/api/sports", (req, res) => {
  db.query("SELECT * FROM sports", (err, result) => {
    if (err) return res.status(500).send("Error fetching sports");
    res.json(result);
  });
});

// POST a new sport
app.post("/api/sports", (req, res) => {
  const { sport_name, season, max_roster_size } = req.body;
  const sql =
    "INSERT INTO sports (sport_name, season, max_roster_size) VALUES (?, ?, ?)";
  db.query(sql, [sport_name, season, max_roster_size], (err, result) => {
    if (err) return res.status(500).send("Error adding sport");
    res.json({ message: "Sport added", sportId: result.insertId });
  });
});

// PUT to update a sport
app.put("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  const { sport_name, season, max_roster_size } = req.body;
  const sql =
    "UPDATE sports SET sport_name=?, season=?, max_roster_size=? WHERE sport_id=?";
  db.query(sql, [sport_name, season, max_roster_size, id], (err) => {
    if (err) return res.status(500).send("Error updating sport");
    res.json({ message: "Sport updated" });
  });
});

// DELETE a sport
app.delete("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM sports WHERE sport_id = ?", [id], (err) => {
    if (err) return res.status(500).send("Error deleting sport");
    res.json({ message: "Sport deleted" });
  });
});

// ===================== 4) ATHLETE_TEAMS Endpoints =====================
// GET all athlete_team relationships
app.get("/api/athlete_teams", (req, res) => {
  db.query("SELECT * FROM athlete_teams", (err, result) => {
    if (err) return res.status(500).send("Error fetching athlete_teams");
    res.json(result);
  });
});

// POST a new relationship
app.post("/api/athlete_teams", (req, res) => {
  const {
    athlete_id,
    team_id,
    jersey_number,
    position,
    is_captain,
    notes,
  } = req.body;
  const sql = `
    INSERT INTO athlete_teams (athlete_id, team_id, jersey_number, position, is_captain, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    athlete_id,
    team_id,
    jersey_number,
    position,
    is_captain,
    notes,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send("Error adding athlete_team");
    res.json({
      message: "Athlete-Team relationship added",
      id: result.insertId,
    });
  });
});

// PUT to update a relationship
app.put("/api/athlete_teams/:id", (req, res) => {
  const id = req.params.id;
  const {
    athlete_id,
    team_id,
    jersey_number,
    position,
    is_captain,
    notes,
  } = req.body;
  const sql = `
    UPDATE athlete_teams SET 
      athlete_id=?, team_id=?, jersey_number=?, position=?, is_captain=?, notes=?
    WHERE athlete_team_id=?
  `;
  const values = [
    athlete_id,
    team_id,
    jersey_number,
    position,
    is_captain,
    notes,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send("Error updating athlete_team");
    res.json({ message: "Athlete-Team relationship updated" });
  });
});

// DELETE a relationship
app.delete("/api/athlete_teams/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM athlete_teams WHERE athlete_team_id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).send("Error deleting athlete_team");
      res.json({ message: "Athlete-Team relationship deleted" });
    }
  );
});

// ===============================================================
// ===================== EMPLOYEES Endpoints =====================
// ===============================================================

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
