function getRequiredEnv(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    user: getRequiredEnv("DB_USER", "postgres"),
    host: getRequiredEnv("DB_HOST", "localhost"),
    database: getRequiredEnv("DB_NAME", "orders_db"),
    password: getRequiredEnv("DB_PASSWORD", "postgres"),
    port: Number(process.env.DB_PORT || 5432)
  },
  auth: {
    jwtSecret: getRequiredEnv("JWT_SECRET", "change-me-in-production"),
    tokenExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    adminUser: getRequiredEnv("ADMIN_USER", "admin"),
    adminPassword: getRequiredEnv("ADMIN_PASSWORD", "admin123")
  }
};

module.exports = config;
