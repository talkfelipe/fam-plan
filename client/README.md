# Family Plan - React Frontend

A mobile-first React app for managing family schedules and finances.

## Getting Started

### Running the App

1. **Start the Rails API** (in the root directory):
   ```bash
   rails server
   # Runs on http://localhost:3000
   ```

2. **Start the React app** (in the client directory):
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

3. Open your browser to `http://localhost:5173`

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main page components
│   │   ├── Login.jsx   # Login page
│   │   ├── Signup.jsx  # Registration page
│   │   └── Dashboard.jsx  # Main calendar view
│   ├── context/        # React Context for state management
│   │   └── AuthContext.jsx  # Authentication state
│   ├── services/       # API communication
│   │   └── api.js      # API calls to Rails backend
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
└── package.json
```

## Key React Concepts Used

### 1. Components
React apps are built from components - reusable pieces of UI. Each .jsx file is a component.

### 2. State (useState)
State is data that can change. When state changes, React re-renders the component.
```javascript
const [count, setCount] = useState(0); // Initial value is 0
setCount(5); // Updates count to 5
```

### 3. Effects (useEffect)
Side effects like API calls, subscriptions. Runs when component mounts or dependencies change.
```javascript
useEffect(() => {
  fetchEvents(); // Runs when component loads
}, []); // Empty array = only run once
```

### 4. Context (useContext)
Share data across components without passing props. Used for user authentication.

### 5. Routing (React Router)
Navigate between pages without full page reloads.

## API Integration

The app communicates with the Rails API at `http://localhost:3000/api`:

- `POST /api/signup` - Create new user
- `POST /api/login` - Log in user
- `DELETE /api/logout` - Log out user
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Next Steps

1. Test the login/signup flow
2. Add create event functionality
3. Add edit/delete event features
4. Improve the calendar UI
5. Add finance tracking features

## Learning Resources

- [React Docs](https://react.dev) - Official React documentation
- [React Router](https://reactrouter.com) - Routing library
- [Axios](https://axios-http.com) - HTTP client for API requests
