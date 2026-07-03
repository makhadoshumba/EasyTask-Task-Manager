# EasyTask Task Manager(Project solution)
EasyTask is a web application designed to help people organize and manage their daily tasks with ease. It is built to cater to everyone, with the goal of providing a simple and accessible solution for everyone.

Whether you're handling personal to-do lists, managing project activities, or organizing your daily workflow, EasyTask offers an efficient way to stay on top of your responsibilities.

Built with simplicity in mind, EasyTask is accessible to all users. Unlike many task managers that may feel overwhelming or require technical knowledge, EasyTask requires no technical expertise. Its simple and intuitive interface makes it easy to create, track, update, and complete tasks, allowing users to focus on what matters most. 

# Key Features
<pre>
<b>Easy Task Management:</b> Create, update, and delete tasks with a simple and intuitive interface.
<b>Team Visibility:</b> All tasks are visible to every team member, ensuring transparency, collaboration, and better project coordination.
<b>Task Tracking:</b> Easily monitor the progress of tasks from start to completion.
<b>Simple Interface:</b> Clean and minimal design that is easy to use for everyone.
<b>Productivity Focused:</b> Helps users stay organized and focused on what matters most.
<b>Accessible to Everyone:</b> No technical knowledge required to use the application.
</pre>



<h3>Full stack:</h3>
<pre>
-Frontend (VERCEL [HTML/CSS/JS])
-Backend (AZURE WEB APP [Server.js/package.json/package-lock.json])
-Database (AZURE SQL DATABASE [Tasks Table])
-CI/CD (YAML [To simplify the process of deploying to VERCEL & AZURE])
</pre>

<h3>Technologies used:</h3>
<pre>
-<b>VERCEL</b>(front-end)- The frontend file was hosted on <b>Vercel</b> due it its fast, efficient <b>CDN</b>.
-<b>Azure Web App</b>(backend)- For the backend I used <b>Azure Web App</b> to deploy my sever because of the speed that it offers and because of its ability to cold start quickly.
-<b>Azure SQL Database</b>(database)- I hosted my database on Azure because it allows for online communication with server so table info can be served into my live website through Rest Api. My local server doesn't allow me to do this. 
-<b>Github</b>- I used Github to create a Continuous Ingestion/ Continuous Deployment pipeline to easily deploy into repository from my local folder, from there github workflow(created) updates my frontend hosted in VERCEL and my backend hosted in Azure Web App creating a pipeline that goes throughout the project.
-<b>SQL Server Management Studio</b>- I used SSMS to manage my cloud database locally, allowing me to check if information is flowing in or out. 
-<b>Visual Studio Code</b>- I used this to compile all my code.
</pre>

<br>
<p><b>Project Architectural diagram:</b><p>

<img src="Frontend/Architectural diagram.jpg" width="600" height="500">
<br>
<h3>Project Structure:</h3>
<pre>
EasyTask task Manager
│
├── Frontend
│   ├── index.html
│   └── favicon.svg
├── Backend (Node.js)
│   ├── server.js
│   ├── packange.json
│   └── package-lock.json
│
└── Database
    └── Azure SQL Database
        └── Tasks
</pre>
<br>
