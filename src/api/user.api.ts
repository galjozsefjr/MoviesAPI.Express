import { NextFunction, Request, Response, Router } from "express";
import { User } from "../models";
import UserService from "../controllers/user.ctrl";

interface AuthorizeRequest extends Request {
  user?: User;
}

export const UserApi = (basePath = '/users'): Router => {
  const router = Router();

  const authorize = (req: AuthorizeRequest, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      const user = UserService.verifyToken(authToken);
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      let statusCode = err.statusCode ?? 400;
      res.status(statusCode).json({
        error: err.message,
        validation: err.validationError,
      });
    }
  };

  router.post(`${basePath}/login`, async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const authToken = await UserService.login(username, password);
      res.json({authToken});
    } catch (err) {
      const status = err.statusCode ?? 400;
      res.status(status).json({
        status,
        error: err.message,
        errors: err.validationError
      });
    }
  });

  router.get(`${basePath}/profile`, authorize, (req: AuthorizeRequest, res: Response) => {
    const { user } = req;
    res.status(200).json(user);
  });

  router.get(`${basePath}/`, authorize, (req: AuthorizeRequest, res: Response) => {
    res.status(200).json(UserService.users);
  });

  return router;
}