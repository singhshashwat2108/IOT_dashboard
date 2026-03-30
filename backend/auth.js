const jwt = require("jsonwebtoken");
const { users } = require("./database");
const db = require("./db"); // Import our sqlite3 database

const SECRET_KEY = "robodeliver-secret-key-123";

// Login controller
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Insert login log into database
  db.run(
    "INSERT INTO login_logs (username) VALUES (?)",
    [user.username],
    function (err) {
      if (err) {
        console.error("Error logging login to DB:", err.message);
      }
    }
  );

  // Generate a dummy token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    },
  });
};

// Forgot Password controller
const forgotPassword = (req, res) => {
  const { fullName, address, username, email } = req.body;

  if (!fullName || !address || !username || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = users.find(
    (u) =>
      u.username === username &&
      u.email === email &&
      u.fullName === fullName
  );

  if (!user) {
    return res.status(404).json({ message: "User not found with these details." });
  }

  // In a real application, we would generate a reset token and send an email
  res.status(200).json({ message: "Password reset link sent to registered email." });
};

module.exports = {
  login,
  forgotPassword,
};

