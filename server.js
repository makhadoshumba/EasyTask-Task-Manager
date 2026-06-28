const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// CLEAN SQL CONFIG (NO NTLM, NO DOMAIN, NO LOGIN ERRORS)
const dbConfig = {
    server: "DESKTOP-E4ICHTJ\\SQLEXPRESS01",
    database: "TaskDB",
    user: "easytask_user",
    password: "Password123!",
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

async function startServer() {
    try {
        // Connect to SQL Server
        await sql.connect(dbConfig);
        console.log("Connected to SQL Server");

        // Create table if not exists
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

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.log("Error connecting to database:", err);
    }
}

startServer();

// GET all tasks
app.get("/tasks", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM tasks");

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving tasks"
        });
    }
});

// POST a new task
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
        console.error(error);
        res.status(500).json({
            message: "Error creating task"
        });
    }
});

// DELETE a task by ID
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
        console.error(error);
        res.status(500).json({
            message: "Error deleting task"
        });
    }
});