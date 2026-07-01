require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Basic sanity check (prevents silent crashes)
 */
console.log("🚀 Starting app...");
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);

/**
 * SQL CONFIG
 */
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool = null;

/**
 * DB CONNECTION (SAFE - DOES NOT CRASH APP)
 */
async function connectDB() {
    try {
        console.log("🔌 Connecting to DB...");

        pool = await sql.connect(config);

        console.log("✅ DB connected");

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tasks')
            BEGIN
                CREATE TABLE tasks (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    title NVARCHAR(255),
                    description NVARCHAR(MAX)
                )
            END
        `);

        console.log("✅ Table ready");

    } catch (err) {
        console.error("❌ DB CONNECTION ERROR:");
        console.error(err.message);

        pool = null; // IMPORTANT: prevent crash
    }
}

/**
 * HEALTH CHECK
 */
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

/**
 * GET TASKS
 */
app.get("/tasks", async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ message: "DB not connected" });
        }

        const result = await pool.request().query("SELECT * FROM tasks");
        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});

/**
 * CREATE TASK
 */
app.post("/tasks", async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ message: "DB not connected" });
        }

        const { title, description } = req.body;

        await pool.request()
            .input("title", sql.NVarChar, title)
            .input("description", sql.NVarChar, description)
            .query(`
                INSERT INTO tasks (title, description)
                VALUES (@title, @description)
            `);

        res.status(201).json({ message: "Task created" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating task" });
    }
});

/**
 * DELETE TASK
 */
app.delete("/tasks/:id", async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ message: "DB not connected" });
        }

        const { id } = req.params;

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM tasks WHERE id = @id");

        res.json({ message: "Task deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting task" });
    }
});

/**
 * START SERVER (VERY IMPORTANT FOR AZURE)
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // connect DB AFTER server starts (prevents Azure crash)
    connectDB();
});