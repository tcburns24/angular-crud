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
    rejectUnauthorized: false, // Required for Supabase SSL
  },
});

// database configuration
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 14,
//   queueLimit: 0,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ Connected to FreeSQLDatabase MySQL!");
// });

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

  const sql = `insert into athletes (first_name, last_name, class_year, gender, fall_sport_id,
    winter_sport_id, spring_sport_id) values ($1, $2, $3, $4, $5, $6, $7)`;
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
      athleteId: result.insertId,
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

// Endpoint: GET Fall, Winter, Spring sports for athlete
app.get("/api/athletes-with-sports", (req, res) => {
  const sql = `
    SELECT 
      a.athlete_id,
      a.first_name,
      a.last_name,
      a.class_year,
      a.gender,
      a.fall_sport,
      a.winter_sport,
      a.spring_sport,
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

  pool.query(sql, (err, result) => {
    if (err) return res.status(500).send("Error athletes-with-sports");
    res.json(result);
  });
});

// ===================== 2) SPORTS Endpoints =====================
// GET all sports
app.get("/api/sports", (req, res) => {
  const sql = `SELECT * FROM sports`;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sports", err);
      return res.status(500).send("DB Error");
    }
    res.json(results);
  });
});

// POST a new sport
app.post("/api/sports", (req, res) => {
  const { sport_name, season, max_roster_size } = req.body;
  const sql =
    "INSERT INTO sports (sport_name, season, max_roster_size) VALUES ($1, $2, $3)";
  pool.query(sql, [sport_name, season, max_roster_size], (err, result) => {
    if (err) return res.status(500).send("Error adding sport");
    res.json({ message: "Sport added", sportId: result.insertId });
  });
});

// PUT to update a sport
app.put("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  const { sport_name, season, max_roster_size } = req.body;
  const sql =
    "UPDATE sports SET sport_name=$1, season=$2, max_roster_size=$3 WHERE sport_id=$4";
  pool.query(sql, [sport_name, season, max_roster_size, id], (err) => {
    if (err) return res.status(500).send("Error updating sport");
    res.json({ message: "Sport updated" });
  });
});

// DELETE a sport
app.delete("/api/sports/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM sports WHERE sport_id = $1", [id], (err) => {
    if (err) return res.status(500).send("Error deleting sport");
    res.json({ message: "Sport deleted" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
