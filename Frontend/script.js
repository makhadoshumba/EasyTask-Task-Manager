const API_URL = "https://taskmanger-backend-cgeca9g8engqgvbd.southafricanorth-01.azurewebsites.net/tasks";
let tasks = [];

/* ── LOAD ── */
async function loadTasks() {
    const taskList = document.getElementById("taskList");
    const loading = document.getElementById("loadingTasks");

    loading.style.display = "flex";
    taskList.style.display = "none";

    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        tasks = await res.json();

        renderTasks(tasks);

        loading.style.display = "none";
        taskList.style.display = "flex";

    } catch (err) {
        console.error(err);

        loading.style.display = "none";
        taskList.style.display = "block";

        taskList.innerHTML = `
            <div class="empty">
                <span class="empty-icon">⚡</span>
                <h3>Can't reach the server</h3>
                <p>Please try again in a moment.</p>
            </div>`;
    }
}

/* ── RENDER ── */
function renderTasks(data) {
    const list  = document.getElementById("taskList");
    const count = document.getElementById("taskCount");
    count.textContent = `${data.length} Task${data.length !== 1 ? "s" : ""}`;

    if (!data.length) {
        list.innerHTML = `
            <div class="empty">
                <span class="empty-icon">📋</span>
                <h3>All clear!</h3>
                <p>Create your first task using the form on the left.</p>
            </div>`;
        return;
    }

    list.innerHTML = data.map(t => `
        <div class="task-card">
            <div class="task-body">
                <span class="task-id">#${t.id}</span>
                <div class="task-title">${t.title}</div>
                <div class="task-desc">${t.description}</div>
            </div>
            <button class="del-btn" onclick="deleteTask(${t.id})" title="Delete task" aria-label="Delete task">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                </svg>
            </button>
        </div>
    `).join("");
}

/* ── CREATE ── */
document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title       = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    if (!title || !description) return;
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description })
        });
        e.target.reset();
        loadTasks();
    } catch (err) { console.error(err); }
});

/* ── DELETE ── */
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadTasks();
    } catch (err) { console.error(err); }
}

/* ── SEARCH ── */
document.getElementById("search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    renderTasks(tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    ));
});

loadTasks();