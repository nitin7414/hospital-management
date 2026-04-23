import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma CLI config for commands like `prisma db push`.
 * Ensures datasource.url is explicitly provided from DATABASE_URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
