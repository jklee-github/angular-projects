import { Request } from 'express';
import { UserDocument } from './user.interface';

export interface ExpressRequestInterface extends Request {
  user?: UserDocument; // user is optional since not every req user must be authorized
}
