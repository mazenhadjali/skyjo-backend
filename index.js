const express = require("express");
const mongoose = require("mongoose");
const { SERVER_PORT, MONGO_URI } = require("./src/config/server.config");
const app = express();

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { autoIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });


app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Mount routes
try {
    app.use("/auth", require("./src/routes/auth.routes"));
} catch (e) {
    // Route may be implemented later; avoid crash if missing
}

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
