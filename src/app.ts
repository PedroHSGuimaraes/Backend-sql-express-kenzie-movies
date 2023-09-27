import "dotenv/config";
import express from "express";
import { connectDatabase, createDatabaseTable } from "./database";
import {
  createMovie,
  deleteMovie,
  getMovieId,
  getMovies,
  updateMovie,
} from "./logic";
import { checkMovieId, checkMovieName, checkMovieNameDelete } from "./middlewares";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/movies", getMovies);
app.get("/movies/:id", checkMovieId, getMovieId);
app.post("/movies", checkMovieName, createMovie);
app.patch("/movies/:id", checkMovieId, checkMovieName, updateMovie);
app.delete("/movies/:id", checkMovieId, checkMovieNameDelete,deleteMovie);

app.listen(PORT, async () => {
  await connectDatabase();
  await createDatabaseTable();
  console.log(`Server is running on port ${PORT}`);
});
