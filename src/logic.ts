import { Request, Response } from "express";
import { client } from "./database";
import { IMovie } from "./interface";
import { QueryConfig } from "pg";

export const getMovies = async (req: Request, res: Response) => {
  const { category } = req.query;
  let query = `SELECT * FROM movies`;
  const values: any[] = [];

  if (category) {
    query += ` WHERE category = $1`;
    values.push(category);
  }

  try {
    const queryConfig: QueryConfig = {
      text: query,
      values,
    };
    const data = await client.query<IMovie>(queryConfig);

    if (data.rows.length === 0) {
      const allMoviesData = await client.query<IMovie>(`SELECT * FROM movies`);
      return res.status(200).json(allMoviesData.rows);
    }
    res.status(200).json(data.rows);
  } catch (error) {
    res.status(404).json({ message: "Movie not found!" });
  }
};

export const getMovieId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `SELECT * FROM movies WHERE id = $1;`;

  const data = await client.query<IMovie>(query, [id]);
  if (data.rows.length === 0) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json(data.rows[0] as IMovie);
};

export const createMovie = async (req: Request, res: Response) => {
  const { name, category, duration, price } = req.body;
  const queryString = `
    INSERT INTO movies (name, category, duration, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
   `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name, category, duration, price],
  };

  const query = await client.query(queryConfig);

  return res.status(201).json(query.rows[0]);
};

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No updates provided" });
  }

  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const queryString = `
    UPDATE movies
    SET ${setClause}
    WHERE id = $${Object.keys(updates).length + 1}
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [...Object.values(updates), id],
  };

  const data = await client.query<IMovie>(queryConfig);
  return res.status(200).json(data.rows[0] as IMovie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const queryString = `
    DELETE FROM movies 
    WHERE id = $1
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query<IMovie>(queryConfig);

  return res.status(204).json();
};
