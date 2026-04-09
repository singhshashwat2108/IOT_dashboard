// Simple in-memory mock database for auth demo
let users = [
  {
    id: 1,
    username: "admin",
    password: "password123", // In a real app this should be hashed
    fullName: "Admin User",
    email: "admin@robodeliver.io",
    address: "123 Tech Lane, Silicon Valley"
  }
];

module.exports = {
  users
};
