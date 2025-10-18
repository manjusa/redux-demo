import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    // optional example:
    // { id: '1', platform: 'twitter', username: '@demo', createdAt: '...' }
  ],
};

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const handlesSlice = createSlice({
  name: "handles",
  initialState,
  reducers: {
    addHandle: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      //  prepare function formats incoming data before it's processed by a reducer.
      /* 
        When you call dispatch(addHandle({ platform: "twitter", username: "@john" })), 
        the prepare function runs FIRST
        The prepare function processes and formats the data (adds id, timestamp, normalizes username)
        The returned payload from prepare becomes the action.payload that the reducer receives
        THEN the reducer function runs with that prepared payload

        // 1. You dispatch the action
        dispatch(addHandle({ platform: "twitter", username: "@john" }));

        // 2. prepare runs first and returns:
            {
            payload: {
                id: "someUniqueId",
                platform: "twitter",
                username: "john", // @ removed
                createdAt: "2025-10-17T..." // timestamp added
            }
            }

        // 3. Then reducer runs with that prepared payload:
        reducer(state, {
        type: "handles/addHandle",
        payload: {  // <- this is what prepare returned
            id: "someUniqueId",
            platform: "twitter",
            username: "john",
            createdAt: "2025-10-17T..."
        }
        });
      */
      prepare({ platform, username }) {
        const id = makeId();
        const createdAt = new Date().toISOString();
        const normalizedUsername = username.startsWith("@")
          ? username.slice(1)
          : username;
        return {
          payload: { id, platform, username: normalizedUsername, createdAt },
        };
      },
    },
    updateHandle(state, action) {
      const { id, platform, username } = action.payload;
      const idx = state.items.findIndex((h) => h.id === id);
      if (idx !== -1) {
        if (platform !== undefined) state.items[idx].platform = platform;
        if (username !== undefined) {
          state.items[idx].username = username.startsWith("@")
            ? username.slice(1)
            : username;
        }
      }
    },
    removeHandle(state, action) {
      const id = action.payload;
      state.items = state.items.filter((h) => h.id !== id);
    },
    loadHandles(state, action) {
      state.items = action.payload || [];
    },
    clearAll(state) {
      state.items = [];
    },
  },
});
export const { addHandle, updateHandle, removeHandle, loadHandles, clearAll } =
  handlesSlice.actions;

// Selectors
export const selectAllHandles = (state) => state.handles.items;
export const selectHandleById = (state, id) =>
  state.handles.items.find((h) => h.id === id);
export const selectHandlesByPlatform = (state, platform) =>
  state.handles.items.filter((h) => h.platform === platform);

export default handlesSlice.reducer;
