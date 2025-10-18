import { configureStore } from "@reduxjs/toolkit";
import handlesReducer from "../features/handles/handlesSlice";
//Purpose: configure the Redux store and optionally load/save handles from localStorage.

const LOCALSTORAGE_KEY = "redux_demo_handles";

function loadState() {
  try {
    const serializedState = localStorage.getItem(LOCALSTORAGE_KEY);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

/*saveState
summary:Takes the current state as an argument
Converts the state object to a JSON string using JSON.stringify()
Saves it to the browser's localStorage using a predefined key (LOCALSTORAGE_KEY)
Includes error handling in case serialization fails or localStorage is full/disabled
This pattern is commonly used to:

Persist Redux state across page refreshes
Implement features like "Save to local storage"
Cache application state for faster initial loads
*/
function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCALSTORAGE_KEY, serializedState);
  } catch (err) {
    console.log(err);
  }
}
const preloadedState = loadState();

//create store first
export const store = configureStore({
  reducer: {
    handles: handlesReducer,
  },
  preloadedState,
});

// THEN subscribe AFTER it's created:
// This code sets up a listener on the Redux store. The subscribe method runs the provided callback
// function every time the store's state changes. It's like setting up an automatic save
//  feature.
store.subscribe(() => {
  saveState(store.getState());
});

// 3. Export as default
export default store;
