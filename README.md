# TS-FB Monorepo for tribes

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
