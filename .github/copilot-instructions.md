# Copilot Instructions for Literature Matcher

## Project Overview
The Literature Matcher is a React application that utilizes Supabase for backend services. The application is structured to facilitate user interactions with literature data, leveraging modern web technologies.

## Architecture
- **Main Components**: The application consists of several key components:
  - `App.js`: The main application component that serves as the entry point.
  - `supabase.js`: Initializes the Supabase client for database interactions.
  - `setupProxy.js`: Configures a proxy for API requests to external services, specifically for the Anthropic API.
  
- **Data Flow**: The application communicates with Supabase for data storage and retrieval. The proxy setup allows for seamless integration with external APIs while managing CORS issues.

## Developer Workflows
- **Running the Application**: Use the following command to start the development server:
  ```bash
  npm start
  ```
  This will run the app in development mode and open it in your browser at [http://localhost:3000](http://localhost:3000).

- **Testing**: To run tests, use:
  ```bash
  npm test
  ```
  This command launches the test runner in interactive watch mode.

- **Performance Monitoring**: The `reportWebVitals.js` file is set up to measure performance metrics. You can log results by passing a function to `reportWebVitals`.

## Project-Specific Conventions
- **Styling**: The application uses CSS for styling, with a focus on responsive design. The `App.css` file contains styles that are applied globally.
- **State Management**: React's built-in hooks (`useState`, `useEffect`, etc.) are utilized for managing component state and side effects.

## Integration Points
- **Supabase**: The application relies on Supabase for user authentication and data management. Ensure that the environment variables `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` are set correctly in your environment.
  
- **Proxy Configuration**: The `setupProxy.js` file is crucial for routing API requests to the Anthropic service. It handles API key management and CORS headers.

## Examples of Patterns
- **Component Structure**: Components are organized in a flat structure within the `src` directory. Each component file typically exports a single React component.
- **API Interaction**: Use the `supabase` client to interact with the database. For example:
  ```javascript
  const { data, error } = await supabase
    .from('literature')
    .select('*');
  ```

## Conclusion
This document serves as a guide for AI coding agents to understand the structure and workflows of the Literature Matcher project. For any unclear or incomplete sections, please provide feedback for further iterations.
