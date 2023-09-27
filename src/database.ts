import { Client } from "pg";

export const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
});

export const connectDatabase = async () => {
  try {
    await client.connect();
    console.log("Database sucessfully connected.");
  } catch (error) {
    console.log(error);
  }
};

export const createDatabaseTable = async () => {
  try {
    const query = `
                    CREATE TABLE IF NOT EXISTS movies (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(50) NOT NULL,
                    category VARCHAR(20) NOT NULL,
                    duration INTEGER NOT NULL,
                    price NUMERIC NOT NULL
                    
    );`;

    await client.query(query);
    console.log("Table successfully created.");
  } catch (error) {
    console.log(error);
  }
};
