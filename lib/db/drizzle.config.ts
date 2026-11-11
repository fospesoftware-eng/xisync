import { defineConfig } from "drizzle-kit";
import path from "path";
import { existsSync } from "node:fs";

const rootEnv = path.join(__dirname, "../../.env");
if (!process.env.DATABASE_URL && existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
