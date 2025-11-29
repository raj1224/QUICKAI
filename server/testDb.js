import sql from "./configs/db.js";

try {
  const result = await sql`SELECT NOW()`;
  console.log("DB Connected →", result);
} catch (err) {
  console.log("❌ DB ERROR →", err.message);
}
