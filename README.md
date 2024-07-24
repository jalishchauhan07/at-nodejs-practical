<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README - User Authentication with Express.js, EJS, and Node.js</title>
</head>
<body>
    <h1>User Authentication with Express.js, EJS, and Node.js</h1>

    <p>This repository contains a Node.js application that demonstrates user authentication and displays user information using Express.js and EJS. The application allows users to register, log in, and view their profile information.</p>

    <h2>Features</h2>
    <ul>
        <li>User registration</li>
        <li>User login</li>
        <li>Displaying user profile information</li>
        <li>Session management for authenticated users</li>
    </ul>

    <h2>Installation</h2>
    <ol>
        <li>Clone the repository:</li>
        <pre><code>git clone https://github.com/your-username/your-repository.git</code></pre>

        <li>Navigate to the project directory:</li>
        <pre><code>cd your-repository</code></pre>

        <li>Install the dependencies:</li>
        <pre><code>npm install</code></pre>
    </ol>

    <h2>Configuration</h2>
    <p>Create a `.env` file in the root directory of the project and add the following environment variables:</p>
    <pre><code>PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database
SESSION_SECRET=your-session-secret
</code></pre>

    <h2>Usage</h2>
    <ol>
        <li>Start the application:</li>
        <pre><code>npm start</code></pre>

        <li>Open your browser and navigate to <a href="http://localhost:3000">http://localhost:3000</a></li>
    </ol>

    <h2>Routes</h2>
    <ul>
        <li><strong>GET /</strong> - Home page</li>
        <li><strong>GET /register</strong> - Registration page</li>
        <li><strong>POST /register</strong> - Handle user registration</li>
        <li><strong>GET /login</strong> - Login page</li>
        <li><strong>POST /login</strong> - Handle user login</li>
        <li><strong>GET /profile</strong> - User profile page (requires authentication)</li>
        <li><strong>GET /logout</strong> - Log out the user</li>
    </ul>

    <h2>Technologies Used</h2>
    <ul>
        <li><a href="https://expressjs.com/" target="_blank">Express.js</a> - Web application framework for Node.js</li>
        <li><a href="https://ejs.co/" target="_blank">EJS</a> - Embedded JavaScript templating</li>
        <li><a href="https://nodejs.org/" target="_blank">Node.js</a> - JavaScript runtime environment</li>
        <li><a href="https://mongodb.com/" target="_blank">MongoDB</a> - NoSQL database</li>
        <li><a href="https://www.npmjs.com/" target="_blank">npm</a> - Node package manager</li>
    </ul>

    <h2>Contributing</h2>
    <p>Feel free to open issues and submit pull requests. Your contributions are welcome!</p>

    <h2>License</h2>
    <p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</
