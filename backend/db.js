const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "robot_logs.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    
    // Create tables if they do not exist
    db.run(
      `CREATE TABLE IF NOT EXISTS login_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        login_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating login_logs table:", err.message);
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS state_change_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating state_change_logs table:", err.message);
      }
    );
  }
});

module.exports = db;
