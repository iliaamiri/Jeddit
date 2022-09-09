const dotenv = require('dotenv');
const app = require("./app");
dotenv.config();

if (process.env.DEBUG === "TRUE") {
    console.log("=============================== The project is in 'Debug Mode'. To turn it off, change the DEBUG variable in .env to FALSE")
} else {
    const app = require('./app.js');

    const PORT = 8000;

    app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))
}