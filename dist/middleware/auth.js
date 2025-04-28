"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const https_1 = __importDefault(require("https"));
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
// Cache public keys
let publicKeys = {};
let lastFetched = 0;
async function fetchPublicKeys() {
    return new Promise((resolve, reject) => {
        https_1.default.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                publicKeys = JSON.parse(data);
                lastFetched = Date.now();
                resolve();
            });
        }).on('error', reject);
    });
}
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        // Fetch public keys if not cached or expired (24 hours)
        if (!Object.keys(publicKeys).length || Date.now() - lastFetched > 24 * 60 * 60 * 1000) {
            await fetchPublicKeys();
        }
        // Split JWT into header, payload, and signature
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        const header = JSON.parse(buffer_1.Buffer.from(headerB64, 'base64').toString('utf8'));
        const payload = JSON.parse(buffer_1.Buffer.from(payloadB64, 'base64').toString('utf8'));
        // Get the key ID (kid)
        const kid = header.kid;
        if (!publicKeys[kid]) {
            res.status(401).json({ error: 'Unauthorized - Invalid key ID' });
            return;
        }
        // Verify the signature
        const publicKey = publicKeys[kid];
        const verifier = crypto_1.default.createVerify('RSA-SHA256');
        verifier.update(`${headerB64}.${payloadB64}`);
        const isValid = verifier.verify(publicKey, buffer_1.Buffer.from(signatureB64, 'base64'));
        if (!isValid) {
            res.status(401).json({ error: 'Unauthorized - Invalid signature' });
            return;
        }
        // Verify token claims
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            res.status(401).json({ error: 'Unauthorized - Token expired' });
            return;
        }
        if (payload.iss !== `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`) {
            res.status(401).json({ error: 'Unauthorized - Invalid issuer' });
            return;
        }
        if (payload.aud !== process.env.FIREBASE_PROJECT_ID) {
            res.status(401).json({ error: 'Unauthorized - Invalid audience' });
            return;
        }
        // Token is valid; attach user to request
        req.user = {
            uid: payload.sub,
            email: payload.email || '',
        };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};
exports.authenticateUser = authenticateUser;
