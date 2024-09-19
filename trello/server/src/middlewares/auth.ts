import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config';
import UserModel from '../models/user';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

// should be async cuz we want to work with db
export default async (
  req: ExpressRequestInterface, // we must extend the req since express has no user field in express's req
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    const data = jwt.verify(token, secret) as { id: string; email: string };
    const user = await UserModel.findById(data.id);

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user; // set the user into req
    next(); // pass req to the controller
  } catch (err) {
    // unauthorize
    // cannot find the user, means user is not logged in
    res.sendStatus(401);
  }
};
