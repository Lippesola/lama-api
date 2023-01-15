module.exports = {
  HOST: process.env.DB_HOST || "127.0.0.1",
  USER: process.env.DB_USER || "root",
  PASS: process.env.DB_PASS || "root",
  DB: process.env.DB_NAME || "lama"
};