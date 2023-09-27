import { Request, Response } from "express";
import { client } from "./database";
import { IMovie } from "./interface";

export const getMovies = async (req: Request, res: Response) => {
  const { category } = req.query;
  let query = `SELECT * FROM movies`;
  if (category) {
    query += ` WHERE category = '${category}'`;
  }

  try {
    const data = await client.query(query);
    res.status(200).json({ movies: data.rows });
  } catch (error) {
    res.status(404).json({ message: "Movie not found!" });
  }
};

export const getMovieId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `SELECT * FROM movies WHERE id = ${id};`;

  const data = await client.query<IMovie>(query);
  if (data.rows.length === 0) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json({ movie: data.rows[0] });
};

export const createMovie = async (req: Request, res: Response) => {
  const { name, category, duration, price } = req.body;
  const query = `
    INSERT INTO movies (name, category, duration, price)
    VALUES ('${name}', '${category}', ${duration}, ${price})
    RETURNING *;
   `;

  const data = await client.query<IMovie>(query);
  return res
    .status(201)
    .json({ message: "Movie sucessfully created.", movies: data.rows[0] });
};

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, duration, price } = req.body;

  let query = `UPDATE movies SET `;

  const fields = [];

  if (name !== undefined) {
    fields.push(`name = '${name}'`);
  }

  if (category !== undefined) {
    fields.push(`category = '${category}'`);
  }

  if (duration !== undefined) {
    fields.push(`duration = ${duration}`);
  }

  if (price !== undefined) {
    fields.push(`price = ${price}`);
  }

  query += fields.join(", ");
  query += ` WHERE id = ${id} RETURNING *;`;

  const data = await client.query<IMovie>(query);
  return res
    .status(200)
    .json({ message: "Movie sucessfully updated.", movies: data.rows[0] });
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `
    DELETE FROM movies 
    WHERE id = ${id}
    RETURNING *;
   `;

  const data = await client.query(query);

  res
    .status(200)
    .json({ message: "Movie sucessfully deleted.", movies: data.rows });
};
