import { Request, Response } from "express";
import { Redis } from "ioredis";

// import session from "express-session";

// declare global {
//   namespace Express {
//     interface Session {
//       userId?: number; // Add any custom properties to session
//     }
//   }
// }

interface Session {
  userId?: number; // Add any custom properties to session
}

export type MyContext = {
  //req: Request; //& { session: Express.Session };
  session: Session;
  res: Response;
  redis: Redis;
};
