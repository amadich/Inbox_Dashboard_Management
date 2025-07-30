# Inbox Dashboard

## Overview
Inbox Dashboard is a comprehensive project management and analytics platform designed to streamline workflows, enhance team collaboration, and provide actionable insights. Built with modern web technologies, it offers a user-friendly interface and robust features to manage tasks, projects, schedules, and more.

## Features
- **Task Management**: Create, update, and delete tasks with customizable priorities, statuses, and progress tracking.
- **Project Management**: Organize and monitor projects with detailed analytics and reporting.
- **Schedule Management**: Plan and track schedules with an intuitive calendar interface.
- **Team Collaboration**: Manage team members and clients with dedicated views and tools.
- **Reports and Analytics**: Generate insightful reports on product statuses, price distributions, and monthly stock.
- **Localization**: Fully translated user-facing text into Arabic for enhanced accessibility.

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
   git clone https://github.com/your-repo/inbox_dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd inbox_dashboard
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

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

