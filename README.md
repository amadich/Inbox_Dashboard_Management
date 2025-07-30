<img width="2063" height="400" alt="image" src="https://github.com/user-attachments/assets/054c1e69-bd8a-4395-a73a-fd66203e6db2" />


## Overview
Inbox Dashboard is a comprehensive project management and analytics platform designed to streamline workflows, enhance team collaboration, and provide actionable insights. Built with modern web technologies, it offers a user-friendly interface and robust features to manage tasks, projects, schedules, and more.

<img width="1364" height="768" alt="image" src="https://github.com/user-attachments/assets/dd6167a3-0c5a-4a5c-84e5-c167fd102654" />


## Features
- **Task Management**: Create, update, and delete tasks with customizable priorities, statuses, and progress tracking.
- **Project Management**: Organize and monitor projects with detailed analytics and reporting.
- **Schedule Management**: Plan and track schedules with an intuitive calendar interface.
- **Team Collaboration**: Manage team members and clients with dedicated views and tools.
- **Reports and Analytics**: Generate insightful reports on product statuses, price distributions, and monthly stock.
- **Localization**: Fully translated user-facing text into Arabic for enhanced accessibility.

<img width="1280" height="1405" alt="image" src="https://github.com/user-attachments/assets/4dfef002-08d5-4975-aa26-700fd92600a3" />


## Technologies Used
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Apollo Server, GraphQL
- **Database**: MongoDB
- **State Management**: Apollo Client
- **Other Tools**: Recharts, Heroicons, SweetAlert2

## Project Structure
```
client/
  src/
    app/
      (pages)/
        Activities/
        Dashboard/
        Products/
        Profile/
        Projects/
        Records/
        Register/
        Reports/
        Schedule/
        Settings/
        Tasks/
      components/
      graphql/
      assets/
      data/
      lib/
      utils/
server/
  src/
    config/
    graphql/
    models/
    services/
    utils/
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/amadich/Inbox_Dashboard_Management.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Inbox_Dashboard_Management
   ```
3. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && yarn install
   ```

## Usage
1. Start the development server for the client:
   ```bash
   cd client && npm run dev
   ```
2. Start the backend server:
   ```bash
   cd server && yarn run dev
   ```
3. Open your browser and navigate to `http://localhost:3000` to access the application.


