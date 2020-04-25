import { userInfo } from 'os';
import { Response } from 'express';
import { Request } from 'express';
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res : Response, next : any) => {
   // Get the jwt token from the head
   console.log("token" + req.headers["x-auth-token"]);
  const token = req.headers["x-auth-token"] as string;

  if (!token) {
    return res.status(401).json({msg:"no token"});
  }

  let jwtPayload;
  
  // Try to validate the token and get data
  try {
    jwtPayload = (jwt.verify(token, "mysecrettokoen") as any);
    req.app.locals.payLoad = jwtPayload;
  } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
    return res.status(401).json({msg:"token not valid"});
  }
    // The token is valid for 1 hour
  // We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, "mysecrettokoen", {
    expiresIn: "1h"
  });
  res.setHeader("token", newToken);
 
  next();

}
export default authMiddleware;