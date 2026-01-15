const { verifyToken } = require('@clerk/backend');

/**
 * Middleware to verify Clerk JWT token and attach user info to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify the token using Clerk
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        });

        // Attach user info to request object
        req.auth = {
            userId: payload.sub, // Clerk uses 'sub' claim for user ID
            sessionId: payload.sid,
        };

        next();
    } catch (error) {
        console.error('Auth error:', error.message);

        // Handle specific error cases
        if (error.message.includes('expired')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token has expired. Please sign in again.'
            });
        }

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or malformed token'
        });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token provided
 * Useful for endpoints that work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without auth
            req.auth = null;
            return next();
        }

        const token = authHeader.substring(7);

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        });

        req.auth = {
            userId: payload.sub,
            sessionId: payload.sid,
        };

        next();
    } catch (error) {
        // If token verification fails, just continue without auth
        console.warn('Optional auth failed:', error.message);
        req.auth = null;
        next();
    }
};

module.exports = {
    requireAuth,
    optionalAuth
};
