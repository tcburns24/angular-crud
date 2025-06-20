const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("🌟🌟DATABASE_URL:", process.env.DATABASE_URL);

// ===================== 1) ATHLETES Endpoints =====================

// Endpoint: GET athletes
app.get("/api/athletes", (req, res) => {
  const sql = `
  SELECT 
    a.athlete_id,
    a.first_name,
    a.last_name,
    a.class_year,
    a.gender,
    sf.sport_id AS fall_sport_id,
    sw.sport_id AS winter_sport_id,
    ss.sport_id AS spring_sport_id
  FROM athletes a
  LEFT JOIN sports sf ON a.fall_sport_id = sf.sport_id
  LEFT JOIN sports sw ON a.winter_sport_id = sw.sport_id
  LEFT JOIN sports ss ON a.spring_sport_id = ss.sport_id;
`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("🚨 error on GET /athletes", err);
      return res.status(500).send("🚨 error on GET /athletes");
    }
    res.json(result.rows);
  });
});

// Endpoint: POST a new athlete
app.post("/api/athletes", (req, res) => {
  const {
    first_name,
    last_name,
    class_year,
    gender,
    fall_sport_id,
    winter_sport_id,
    spring_sport_id,
  } = req.body;

  if (!first_name || !last_name || !class_year || !gender) {
    return res.status(400).send("Missing athlete request body field(s)");
  }

  const sql = `
INSERT INTO athletes (
  first_name, last_name, class_year, gender, fall_sport_id, winter_sport_id, spring_sport_id
) VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING athlete_id
`;
  const values = [
    first_name,
    last_name,
    class_year,
    gender,
    fall_sport_id,
    winter_sport_id,
    spring_sport_id,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("🚨 POST /athletes error:", err);
      return res.status(500).send(err.message);
    }
    res.status(201).send({
      message: "✅ Athlete successfully POSTed",
      athleteId: result.rows[0].athlete_id,
    });
  });
});

// Endpoint: PUT an existing athlete
app.put("/api/athletes/:id", (req, res) => {
  const id = req.params.id;
  const {
    first_name,
    last_name,
    class_year,
    gender,
    fall_sport_id,
    winter_sport_id,
    spring_sport_id,
  } = req.body;

  const sql = `
UPDATE athletes SET
  first_name = $1,
  last_name = $2,
  class_year = $3,
  gender = $4,
  fall_sport_id = $5, 
  winter_sport_id = $6, 
  spring_sport_id = $7
WHERE athlete_id = $8
`;
  const values = [
    first_name,
    last_name,
    class_year,
    gender,
    fall_sport_id,
    winter_sport_id,
    spring_sport_id,
    id,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("🚨 error on PUT /athletes/:id", err);
      return res.status(500).send("db error");
    }
    res.send({ message: "Athlete successfully updated ✅" });
  });
});

// Endpoint: DELETE an athlete
app.delete("/api/athletes/:id", (req, res) => {
  const id = req.params.id;
  const sql = `delete from athletes where athlete_id = $1`;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("🚨 error on DELETE /athletes/:id", err);
      return res.status(500).send("db error");
    }
    res.send({ message: "Athlete successfully deleted 🗑️" });
  });
});

// ===================== 2) SPORTS Endpoints =====================
// GET all sports
app.get("/api/sports", (req, res) => {
  const sql = `SELECT * FROM sports`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching sports", err);
      return res.status(500).send("DB Error");
    }
    res.json(result.rows);
  });
});

// POST a new sport
app.post("/api/sports", (req, res) => {
  const { sport_name, season, max_roster_size } = req.body;
  const sql = `
  INSERT INTO sports (sport_name, season, max_roster_size) 
  VALUES ($1, $2, $3) 
  RETURNING sport_id
`;
  pool.query(sql, [sport_name, season, max_roster_size], (err, result) => {
    if (err) {
      console.error("Error adding sport:", err);
      return res.status(500).send("Error adding sport");
    }
    res.json({ message: "Sport added", sportId: result.rows[0].sport_id });
  });
});

// PUT to update a sport
app.put("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  const { sport_name, season, max_roster_size } = req.body;
  const sql = `
  UPDATE sports 
  SET sport_name = $1, season = $2, max_roster_size = $3 
  WHERE sport_id = $4
  RETURNING *
`;
  pool.query(sql, [sport_name, season, max_roster_size, id], (err) => {
    if (err) return res.status(500).send("Error updating sport");
    res.json({ message: "Sport updated", sport: result.rows[0] });
  });
});

// DELETE a sport
app.delete("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
  DELETE FROM sports 
  WHERE sport_id = $1 
  RETURNING *
`;
  pool.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Error deleting sport");
    if (result.rowCount === 0) return res.status(404).send("Sport not found");
    res.json({ message: "Sport deleted", sport: result.rows[0] });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
