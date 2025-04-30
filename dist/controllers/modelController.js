"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModels = exports.saveModel = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
// Save a new model
const saveModel = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            (0, responseHandler_1.sendError)(res, 'No authenticated user', 401);
            return;
        }
        const { entities, name, description } = req.body;
        if (!entities || !name) {
            (0, responseHandler_1.sendError)(res, 'Entities and name are required', 400);
            return;
        }
        // Create a reference to a new document
        const modelRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, 'models'));
        const modelData = {
            id: modelRef.id,
            userId: user.uid,
            entities,
            name,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await (0, firestore_1.setDoc)(modelRef, modelData);
        (0, responseHandler_1.sendSuccess)(res, modelData, 'Model saved successfully', 201);
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Failed to save model', 500, error);
    }
};
exports.saveModel = saveModel;
// Get all models
const getModels = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            (0, responseHandler_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        // Get all models
        const modelsRef = (0, firestore_1.collection)(firebase_1.db, 'models');
        const q = (0, firestore_1.query)(modelsRef);
        const snapshot = await (0, firestore_1.getDocs)(q);
        // Convert docs to model objects
        const models = [];
        snapshot.forEach(doc => {
            models.push({
                id: doc.id,
                ...doc.data()
            });
        });
        (0, responseHandler_1.sendSuccess)(res, models, `Found ${models.length} models`, 200);
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Failed to fetch models', 500, error);
    }
};
exports.getModels = getModels;
