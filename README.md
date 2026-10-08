# StudyFlow

StudyFlow is a simple, modern personal study and task management application. Built with the MERN stack (MongoDB, Express, React, Node.js), it helps users keep track of their study tasks, organize them by priority, and monitor basic productivity statistics.

## Features
- Dashboard with dynamic productivity statistics (Total, Completed, Pending, High Priority, Due Today)
- Create, Read, Update, and Delete (CRUD) tasks
- Mark tasks as completed or pending
- Search tasks by title, description, and category
- Filter tasks by status and priority
- Sort tasks by newest, oldest, due date, and priority
- Responsive, modern UI

## Tech Stack
- **Frontend**: React, Vite, React Router DOM, CSS (No external UI libraries)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Architecture
The application uses a standard REST API architecture:
- React frontend communicates with the Express backend via REST API using \`fetch\`.
- The Express backend interacts with MongoDB via the Mongoose ODM to perform database operations.

## Folder Structure
\`\`\`
studyflow/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, TaskCard, etc.)
│   │   ├── pages/          # Page views (Dashboard, Tasks, CreateTask, EditTask)
│   │   ├── services/       # API integration logic
│   │   ├── App.jsx         # Main React Router setup
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json
│
└── server/                 # Express Backend
    ├── config/             # Database configuration
    ├── controllers/        # Request handlers
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routes
    ├── middleware/         # Error handling middleware
    ├── server.js           # Entry point
    └── package.json
\`\`\`

## Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd studyflow
   \`\`\`

2. **Install Backend Dependencies:**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Install Frontend Dependencies:**
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

## Environment Variables

### Backend (\`server/.env\`)
Create a \`.env\` file in the \`server\` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
\`\`\`

### Frontend (\`client/.env\`)
Create a \`.env\` file in the \`client\` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## MongoDB Setup
1. Create a MongoDB Atlas cluster (or use a local instance).
2. Create a database named \`studyflow\`.
3. Obtain the connection string and paste it into \`server/.env\` as \`MONGO_URI\`.

## Running the Backend
From the \`server\` directory:
\`\`\`bash
npm run dev
\`\`\`
The backend will run on \`http://localhost:5000\`.

## Running the Frontend
From the \`client\` directory:
\`\`\`bash
npm run dev
\`\`\`
The frontend will run on \`http://localhost:5173\`.

## API Documentation
| Method | Endpoint | Description |
|---|---|---|
| \`GET\` | \`/api/tasks\` | Get all tasks |
| \`GET\` | \`/api/tasks/:id\` | Get a specific task |
| \`POST\` | \`/api/tasks\` | Create a new task |
| \`PUT\` | \`/api/tasks/:id\` | Update an existing task |
| \`PATCH\` | \`/api/tasks/:id/status\` | Toggle task status |
| \`DELETE\` | \`/api/tasks/:id\` | Delete a task |

## Screenshots
> *(Add screenshots of the Dashboard, Task List, and Task Creation form here)*

## Future Improvements
- User authentication and authorization (JWT)
- Multiple users support
- Task reminders and email notifications
- Calendar integration
- Analytics and charts
- Dark mode
- Drag-and-drop Kanban board
- Docker deployment
