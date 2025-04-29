"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const auth_1 = require("firebase-admin/auth");
// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, responseHandler_1.sendError)(res, 'No authorization token provided', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, responseHandler_1.sendError)(res, 'Invalid token format', 401);
            return;
        }
        try {
            // Use Firebase Admin SDK for token verification
            const decodedToken = await (0, auth_1.getAuth)().verifyIdToken(token);
            req.user = decodedToken;
            next();
        }
        catch (error) {
            (0, responseHandler_1.sendError)(res, 'Invalid or expired token', 401);
            return;
        }
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Authentication failed', 500, error);
    }
};
exports.authenticateUser = authenticateUser;
