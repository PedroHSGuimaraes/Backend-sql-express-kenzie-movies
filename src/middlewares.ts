import { Request, Response, NextFunction } from "express";
import { client } from "./database";

export const checkMovieName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const data = await client.query(
    `SELECT * FROM movies WHERE name = '${name}';`
  );

  if (data.rows.find((movie) => movie.name === name)) {
    return res.status(409).json({ message: "Movie already registered." });
  }

  return next();
};

export const checkMovieId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const data = await client.query(`SELECT * FROM movies WHERE id = ${id};`);

  if (!data.rows.length) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  return next();
};
