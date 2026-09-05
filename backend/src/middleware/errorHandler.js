/**
 * ---------------------------------------------------------
 * Global Error Handler
 * ---------------------------------------------------------
 * Catches application errors
 * and returns standardized error responses.
 */

export function errorHandler(err, req, res, next) {
    console.error('[ERROR]', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';

    res.status(status).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}
