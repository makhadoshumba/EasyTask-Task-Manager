require("dotenv").config();
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
        trustServerCertificate: false, // safer for Azure
        connectTimeout: 30000,
        requestTimeout: 30000
    }
};

async function startServer() {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server");

        const result = await sql.query(`
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
        console.error("DATABASE CONNECTION FAILED ❌", err);
        process.exit(1); // 🔥 stop app so Azure shows real error
    }
}

/**
 * Health check
 */
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

/**
 * GET all tasks
 */
app.get("/tasks", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM tasks");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});

/**
 * POST task
 */
app.post("/tasks", async (req, res) => {
    try {
        const { title, description } = req.body;

        await sql.query`
            INSERT INTO tasks (title, description)
            VALUES (${title}, ${description})
        `;

        res.status(201).json({ message: "Task created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task" });
    }
});

/**
 * DELETE task
 */

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await sql.query`
            DELETE FROM tasks WHERE id = ${id}
        `;

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task" });
    }
});

const PORT = process.env.PORT || 3000;

startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});