"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Get the jwt token from the head
    const token = req.headers["x-auth-token"];
    if (!token) {
        return res.status(401).json({ msg: "no token" });
    }
    let jwtPayload;
    // Try to validate the token and get data
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, "mysecrettokoen");
        req.app.locals.payLoad = jwtPayload;
    }
    catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        return res.status(401).json({ msg: "token not valid" });
    }
    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jsonwebtoken_1.default.sign({ userId, username }, "mysecrettokoen", {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);
    next();
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map