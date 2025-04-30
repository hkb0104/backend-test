"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const auth_1 = require("firebase-admin/auth");
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
        // DEV: Skip verification in emulator mode
        if (process.env.NODE_ENV === 'development') {
            req.user = { uid: 'dev-user-id' };
            next();
            return;
        }
        // PROD: Verify Firebase ID token
        const decodedToken = await (0, auth_1.getAuth)().verifyIdToken(token);
        req.user = { uid: decodedToken.uid };
        next();
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Invalid or expired token', 401);
    }
};
exports.authenticateUser = authenticateUser;
