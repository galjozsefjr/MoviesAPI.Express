import express, { ErrorRequestHandler, Response } from "express";

import { MovieApi, SwaggerApi, UserApi } from "./api";

const DEFAULT_PORT = 4000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const app = express();

const errorHandler: ErrorRequestHandler = (err, _req, res: Response, _next) => {
  res.status(500).json({ error: err?.message || "Something went wrong" });
};

app.use(express.json());
app.use(SwaggerApi());
app.use(MovieApi());
app.use(UserApi());
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});