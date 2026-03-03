import "express";
import { IUserToken } from "@/types/interface/userToken.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUserToken;
    }
  }
}
