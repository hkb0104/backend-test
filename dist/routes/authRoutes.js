"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/appRoutes.ts
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("../controllers/authController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const modelController_1 = require("../controllers/modelController");
const router = express_1.default.Router();
// 🔐 Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getCurrentUser);
router.post('/logout', authController.logout);
// 📦 Model Routes
router.post('/models', authMiddleware_1.authenticateUser, modelController_1.saveModel);
router.get('/models', authMiddleware_1.authenticateUser, modelController_1.getModels); // New GET route
// 📋 Log all registered routes
router.stack.forEach((layer) => {
    if (layer.route) {
        const route = layer.route;
        const methods = Object.keys(route.methods || {})
            .filter(method => method !== '_all')
            .map(m => m.toUpperCase())
            .join(', ');
        console.log(`📄 Registered route: ${methods} /api/${layer.route.path}`);
    }
});
exports.default = router;
