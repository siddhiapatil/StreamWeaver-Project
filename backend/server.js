/**
 * ---------------------------------------------------------
 * StreamWeaver Backend Server
 * ---------------------------------------------------------
 * Entry point of the backend application.
 * Starts the Express server and listens for incoming requests.
 */


const app = require("./src/app");
const { PORT } = require("./src/config/constants");

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});