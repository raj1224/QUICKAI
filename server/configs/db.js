import { neon } from '@neondatabase/serverless';
// console.log("DATABASE_URL:", process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL);

export default sql;
