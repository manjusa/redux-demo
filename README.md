# Redux Demo Project - Learning React Redux

BTW there is a todo-redux-app which also demonstrates
how to use redux. This app i think is more realistic
than todo.

This project demonstrates how React Redux works by building a simple "Social Handles Manager" application. It covers all the core concepts of Redux with Redux Toolkit in an easy-to-understand way.

## 🎯 What This App Does

A simple app to manage your social media handles (Twitter, Instagram, etc.) with full CRUD operations:

- ✅ Add new social handles
- ✅ Edit existing handles
- ✅ Delete handles
- ✅ Persist data to localStorage
- ✅ Real-time state management

## 🏗️ How React Redux Works - Step by Step

### 1. **The Redux Store** (`src/app/store.js`)

The store is the **single source of truth** for your app's state. Think of it as a global database that any component can access.

```javascript
// Create the store with configureStore (Redux Toolkit)
export const store = configureStore({
  reducer: {
    handles: handlesReducer, // Each reducer manages a slice of state
  },
  preloadedState, // Load saved data from localStorage
});
```

**Key Concepts:**

- **Single Store**: Your entire app has ONE store that holds ALL state
- **Reducers**: Pure functions that specify how state changes in response to actions
- **preloadedState**: Initialize store with data (like from localStorage)

### 2. **State Persistence with localStorage**

The app automatically saves and loads state from browser storage:

```javascript
// Load state from localStorage on app start
function loadState() {
  try {
    const serializedState = localStorage.getItem(LOCALSTORAGE_KEY);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

// Save state to localStorage whenever state changes
function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCALSTORAGE_KEY, serializedState);
  } catch (err) {
    console.log(err);
  }
}

// Subscribe to store changes and auto-save
store.subscribe(() => {
  saveState(store.getState());
});
```

**Why This Works:**

- `store.subscribe()` runs a callback **every time** the state changes
- This creates an "automatic save" feature
- When you refresh the page, your data is still there!

### 3. **Slices - Organizing State Logic** (`src/features/handles/handlesSlice.js`)

A **slice** is a collection of Redux logic for a specific feature. It includes:

- Initial state
- Reducer functions (how to update state)
- Action creators (what actions can be dispatched)

```javascript
export const handlesSlice = createSlice({
  name: "handles", // Name for this slice
  initialState: {
    // Starting state
    items: [],
  },
  reducers: {
    // Functions that update state
    addHandle: {
      /* ... */
    },
    updateHandle: {
      /* ... */
    },
    removeHandle: {
      /* ... */
    },
  },
});
```

### 4. **Actions with Prepare Functions**

The `addHandle` action uses a **prepare function** to process data before it reaches the reducer:

```javascript
addHandle: {
  reducer(state, action) {
    state.items.push(action.payload);  // Just add to array
  },
  prepare({ platform, username }) {   // Format data FIRST
    const id = makeId();
    const createdAt = new Date().toISOString();
    const normalizedUsername = username.startsWith("@")
      ? username.slice(1)
      : username;

    return {
      payload: { id, platform, username: normalizedUsername, createdAt }
    };
  }
}
```

**The Flow:**

1. You dispatch: `dispatch(addHandle({ platform: "twitter", username: "@john" }))`
2. **Prepare runs FIRST**: Adds ID, timestamp, removes @ symbol
3. **Reducer runs SECOND**: Gets the prepared payload and adds to state

**Why Use Prepare?**

- Keeps reducers simple and pure
- Centralizes data formatting logic
- Automatically adds metadata (ID, timestamps)

### 5. **Selectors - Reading State**

Selectors are functions that extract specific pieces of state:

```javascript
// Get all handles
export const selectAllHandles = (state) => state.handles.items;

// Get a specific handle by ID
export const selectHandleById = (state, id) =>
  state.handles.items.find((h) => h.id === id);

// Filter handles by platform
export const selectHandlesByPlatform = (state, platform) =>
  state.handles.items.filter((h) => h.platform === platform);
```

**Benefits:**

- Encapsulate state structure knowledge
- Reusable across components
- Can compute derived data

### 6. **Connecting React to Redux**

#### **Provider Setup** (`src/index.js`)

The `Provider` makes the store available to ALL components:

```javascript
import { Provider } from "react-redux";
import store from "./app/store";

root.render(
  <Provider store={store}>
    {" "}
    {/* Wraps entire app */}
    <App />
  </Provider>
);
```

#### **Reading State with useSelector** (`src/features/handles/HandleList.js`)

```javascript
import { useSelector } from "react-redux";
import { selectAllHandles } from "./handlesSlice";

export default function HandleList() {
  const handles = useSelector(selectAllHandles); // Gets state from store

  return (
    <div>
      {handles.map((handle) => (
        <HandleItem key={handle.id} handle={handle} />
      ))}
    </div>
  );
}
```

#### **Dispatching Actions with useDispatch** (`src/features/handles/AddHandleForm.js`)

```javascript
import { useDispatch } from "react-redux";
import { addHandle } from "./handlesSlice";

export default function AddHandleForm() {
  const dispatch = useDispatch(); // Get dispatch function

  function onSubmit(e) {
    e.preventDefault();
    dispatch(addHandle({ platform, username })); // Send action to store
  }

  return <form onSubmit={onSubmit}>...</form>;
}
```

## 🔄 Complete Redux Data Flow

Here's what happens when you add a new handle:

1. **User Action**: User submits form in `AddHandleForm`
2. **Dispatch**: `dispatch(addHandle({ platform: "twitter", username: "@john" }))`
3. **Prepare**: Prepare function adds ID, timestamp, normalizes username
4. **Reducer**: Reducer receives prepared payload and adds to `state.handles.items`
5. **Store Update**: Store state is updated with new handle
6. **Auto-Save**: `store.subscribe()` callback saves to localStorage
7. **Component Re-render**: `HandleList` re-renders because it uses `useSelector(selectAllHandles)`
8. **UI Update**: New handle appears in the list

## 📁 Project Structure

```
src/
├── app/
│   └── store.js              # Redux store configuration + localStorage
├── features/
│   └── handles/
│       ├── handlesSlice.js   # State logic (actions, reducers, selectors)
│       ├── AddHandleForm.js  # Form to add new handles (useDispatch)
│       ├── HandleList.js     # Display all handles (useSelector)
│       └── HandleItem.js     # Individual handle with edit/delete
├── App.js                    # Main app component
└── index.js                  # Provider setup
```

## 🔑 Key Redux Concepts Learned

- **Store**: Single source of truth for app state
- **Actions**: Objects describing what happened (with type and payload)
- **Reducers**: Pure functions that calculate new state based on actions
- **Slices**: Modern way to organize Redux logic with Redux Toolkit
- **Selectors**: Functions to read specific pieces of state
- **useSelector**: React hook to read state from store
- **useDispatch**: React hook to send actions to store
- **Provider**: React component that makes store available to all components
- **Immutability**: Redux requires immutable updates (Redux Toolkit uses Immer under the hood)

## 🚀 Getting Started

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
