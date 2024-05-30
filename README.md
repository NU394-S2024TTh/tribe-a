
# Streamlytics.AI

## Project Overview
A dynamic web application designed for internet advertising agencies, offering comprehensive tools to analyze viewer sentiments and comments on major streaming services like Paramount+. The application provides functionalities for tracking viewer engagement, summarizing sentiments, and viewing historical trends to optimize advertising strategies. Key features include:

### Key Features

1. **Dynamic Data Updates**: Ensures that sentiment and engagement metrics are continuously updated, providing real-time insights.
2. **Visual Sentiment Analytics**: Offers intuitive visualizations of sentiment data, making it easier for agencies to interpret and act on viewer feedback.
3. **AI Chat Interface**: An AI-powered chat interface allows users to interact with the application naturally, querying data, and generating reports through conversational commands.
4. **Comprehensive Viewer Analysis**: Tracks various metrics such as likes, comments, shares, and overall engagement across different streaming platforms.
5. **Historical Trends**: Enables agencies to analyze historical data to identify trends and patterns in viewer behavior over time.

By integrating these features, the application empowers advertising agencies with data-driven insights, enhancing their ability to create effective and targeted advertising campaigns.

## [Application Link](https://streaming-trends-ai.web.app/)


# Project Management

 [Frontend Backlog](https://linear.app/tribe-a/team/FRT/backlog)\
 [Backend Backlog](https://linear.app/tribe-a/team/BAC/backlog)

### Overview of Linear

For our project management needs, we primarily used Linear. Linear is an efficient tool that helped us keep track of our tasks and user stories that needed to be completed. Here’s how we used Linear for our management needs:

1. **Task Delegation and Assignment**: Linear allowed us to delegate and assign tasks to our team members effectively. Each task or user story was assigned to a specific team member, ensuring clear ownership and accountability.

2. **Tracking Progress**: We used Linear to monitor the progress of each task. This included updating the status of tasks (e.g., to-do, in progress, completed) and setting due dates to ensure timely completion.

3. **Managing Issues and Notes**: Linear provided a platform to manage potential issues that arose during the project. Team members could log issues, add notes, and collaborate to resolve them quickly.

4. **Commenting and Discussion**: Each task in Linear had a comment section where team members could discuss details, raise concerns, or provide updates. This feature facilitated clear communication and collaboration among the team.

5. **Prioritization**: Tasks and user stories were prioritized using Fibonacci numbers (1, 2, 3, 5, 8, 13, etc.). This method helped us estimate the complexity and effort required for each task, ensuring that we focused on the most critical items first.


By using Linear, we maintained an organized and transparent workflow, which was crucial for the successful completion of our project.

## Additional Information

### Architectural Design
The project follows a monorepo structure managed by npm workspaces, integrating both the frontend and backend in a single repository.

- **Frontend**: Located in the `web` directory, built with React and Vite. This part of the application handles the user interface and client-side logic.
- **Backend**: Serverless functions located in the `functions` directory, managed by Firebase. These functions handle server-side logic, including API endpoints and background processing.

### Coding Standards
- **CamelCase**: Used for filenames and components to maintain consistency and readability. This helps in distinguishing multi-word names clearly.
- **Kebab-case**: Utilized for branch names to maintain uniformity and distinguish them clearly.

### Directory Structure
- **Root Directory**:
  - **.firebase/**: Contains Firebase configuration files.
  - **.github/workflows/**: Holds CI/CD workflows for GitHub Actions.
  - **.husky/**: Manages Git hooks to enforce code quality and consistency.
  - **functions/**: Contains the backend serverless functions written in TypeScript.
  - **web/**: Contains the frontend application built with React and Vite.
  - **shared/**: Intended for utilities and libraries shared between frontend and backend (not currently operational).

#### Key Files
- **.firebaserc**: Configuration for Firebase projects.
- **firebase.json**: Configuration for Firebase hosting and functions.
- **firestore.indexes.json**: Configuration for Firestore indexes.
- **firestore.rules**: Security rules for Firestore.
- **package.json**: Project metadata, including dependencies and scripts.


## TS-FB Monorepo for tribes

This repository contains a TypeScript monorepo managed by npm workspaces. It includes a React-Vite application in the `/web` directory and Firebase Functions in the `/functions` directory, alongside shared resources in the `/shared` directory.

## Structure

- `/web`: React-Vite frontend application.
- `/functions`: Serverless Firebase Functions.
- `/shared`: Shared utilities and libraries used by both the frontend and backend.

## What's not working

As of this build `/shared` is not working but web and functions will deploy correctly to firebase.

## Setup

### Prerequisites

- Node.js (LTS version)
- npm (version 7 or higher, for workspaces support)
- Firebase CLI (for deploying and managing Firebase services)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ts-fb-monorepo
npm install
```

## Firebase Config

in the file `.firebaserc" change the project to where you want the project to deploy.

### Local Development

To run both the React application and Firebase Functions locally:

1. **Web Application:**

   Navigate to the `/web` directory and start the development server:

   ```bash
   cd web
   npm run dev
   ```

   More information on using the web application is in the [Vite React Typescript Starter Readme](./web/README.md)

2. **Firebase Functions:**

   Ensure that you have Firebase CLI installed and configured. Then navigate to the `/functions` directory and serve the functions locally:

   ```bash
   cd functions
   firebase emulators:start
   ```

   This assumes you have the emulators installed. the function is deployable to firebase with `firebase deploy --only functions`

### Build

To build all workspaces:

```bash
npm run build
```

This command builds both the React application and Firebase Functions.

### Testing

To run tests across all workspaces:

```bash
npm run test
```

## Deployment

To deploy Firebase Functions:

```bash
cd functions
firebase deploy --only functions
```

To build and deploy the web application:

```bash
cd web
npm run build
firebase deploy --only hosting
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
