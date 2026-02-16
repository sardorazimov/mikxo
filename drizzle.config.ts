import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // Şemanın olduğu yer
  out: "./drizzle",            // Migration dosyalarının oluşacağı yer
  dialect: "postgresql",       // Veritabanı tipi
  dbCredentials: {
    url: process.env.DATABASE_URL!, // .env dosyasındaki URL
  },
});