import { Router } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { serve, setup } from "swagger-ui-express";
import { parse } from "yaml";

const SWAGGER = ((path) => {
  try {
    const rawData = readFileSync(path, "utf8");
    return parse(rawData);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})(resolve(__dirname, "swagger.yaml"));

export const SwaggerApi = (rootPath = '/api-docs'): Router => {
  const router = Router();
  router.use(rootPath, serve);
  router.get(rootPath, setup(SWAGGER));

  return router;
};