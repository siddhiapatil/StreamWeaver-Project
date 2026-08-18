/**
 * A thrown error that carries an HTTP status code.
 * Route handlers can `throw new AppError('message', 400)` and pass it to
 * `next(error)`; the global error handler in app.js reads `error.status`
 * and `error.expose` to decide what to send back to the client.
 */
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    // Only messages from AppError (our own, deliberate errors) are safe to
    // send to the client. Unexpected errors stay generic in the response.
    this.expose = true;
  }
}
