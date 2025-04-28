"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.signIn = signIn;
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
// USER CONTROLLERS
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        res.status(201).json({ user: { uid: user.uid, email: user.email }, idToken });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
}
async function signIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const userCredential = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        res.status(200).json({ user: { uid: user.uid, email: user.email }, idToken });
    }
    catch (error) {
        console.error('Sign-in error:', error);
        res.status(400).json({ error: error.message });
    }
}
