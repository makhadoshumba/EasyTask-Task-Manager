const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

app.use(cors());
app.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
        requestTimeout: 30000
    }
};

/**
 * DB CONNECTION
 */
async function startServer() {
    try {
        console.log("=================================");
        console.log("Starting database connection...");
        console.log("DB_SERVER:", process.env.DB_SERVER);
        console.log("DB_NAME:", process.env.DB_NAME);
        console.log("DB_USER:", process.env.DB_USER);
        console.log("=================================");

        await sql.connect(config);

        console.log("Connected to SQL Server");

        await sql.query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tasks')
            BEGIN
                CREATE TABLE tasks (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    title NVARCHAR(255),
                    description NVARCHAR(MAX)
                )
            END
        `);

        console.log("Table ready");

    } catch (err) {
        console.error("=================================");
        console.error("DATABASE CONNECTION ERROR");
        console.error(err);
        console.error("=================================");
    }
}

/**
 * HEALTH CHECK
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

/**
 * DB TEST
 */
app.get("/db-test", async (req, res) => {
    try {
        const result = await sql.query("SELECT 1 AS test");

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("DB TEST ERROR:", error);

        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }
});

/**
 * GET ALL TASKS
 */
app.get("/tasks", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM tasks");

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("GET TASKS ERROR:", error);

        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }
});

/**
 * CREATE TASK
 */
app.post("/tasks", async (req, res) => {
    try {
        const { title, description } = req.body;

        await sql.query`
            INSERT INTO tasks (title, description)
            VALUES (${title}, ${description})
        `;

        res.status(201).json({
            message: "Task created successfully"
        });

    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }
});

/**
 * DELETE TASK
 */
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await sql.query`
            DELETE FROM tasks
            WHERE id = ${id}
        `;

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("DELETE TASK ERROR:", error);

        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 3000;

startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});