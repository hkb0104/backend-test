"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const index_1 = require("../controllers/index");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Explicitly type the handlers
const registerHandler = index_1.register;
const signInHandler = index_1.signIn;
// Auth routes
router.post('/auth/register', registerHandler);
router.post('/auth/login', signInHandler);
exports.default = router;
