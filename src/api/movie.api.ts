import { NextFunction, Request, Response, Router } from "express";
import { ValidationError } from "yup";

import { addMovie, deleteMovie, getMovieById, getMovies, updateMovie } from "../controllers/movie.ctrl";
import { SearchQueryModel } from "../utils/search";
import { MovieBase, MovieBaseModel } from "../models";

export const MovieApi = (basePath = "/movies"): Router => {
  const router = Router();

  router.get(`${basePath}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = await SearchQueryModel.validate(req.query);
      const { offset = 0, limit = 10 } = query;
      const { totalAmount, data } = await getMovies(query);
      res.status(200).json({
        totalAmount,
        data,
        offset,
        limit,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.get(`${basePath}/:id`, async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).end();
        return;
      }
      const movie = await getMovieById(id);
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).json(null);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.delete(`${basePath}/:id`, async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).end();
        return;
      }
      const removedCount = await deleteMovie(id);
      res.status(removedCount ? 204 : 404).end();
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.post(`${basePath}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await MovieBaseModel.validate(req.body, { abortEarly: false });
      const newMovie = await addMovie(movie as MovieBase);
      res.status(201).json(newMovie);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json(err);
        return;
      }
      console.error(err);
      next(err);
    }
  });

  router.put(`${basePath}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.body.id, 10);
      const movie = await MovieBaseModel.validate(req.body, { abortEarly: false });
      const updatedMovie = await updateMovie({
        ...movie as MovieBase,
        id,
      });
      if (updatedMovie) {
        res.status(200).json(updatedMovie);
      } else {
        res.status(404).json({ error: `Movie not found: "${req.body.id}"` });
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json(err);
        return;
      }
      console.error(err);
      next(err);
    }
  })

  return router;
};