// src/features/handles/HandleItem.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateHandle, removeHandle } from "./handlesSlice";

export default function HandleItem({ handle }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(handle.username);
  const [platform, setPlatform] = useState(handle.platform);

  function onSave() {
    const trimmed = username.trim();
    if (!trimmed) return;
    dispatch(updateHandle({ id: handle.id, username: trimmed, platform }));
    setIsEditing(false);
  }

  function onDelete() {
    if (window.confirm("Delete this handle?")) {
      dispatch(removeHandle(handle.id));
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 0",
      }}
    >
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="twitter">twitter</option>
              <option value="instagram">instagram</option>
              <option value="facebook">facebook</option>
              <option value="linkedin">linkedin</option>
              <option value="other">other</option>
            </select>
          </div>
        ) : (
          <div>
            <strong>{handle.platform}</strong>: @{handle.username}
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(handle.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <div>
        {isEditing ? (
          <>
            <button onClick={onSave}>Save</button>
            <button
              onClick={() => {
                setIsEditing(false);
                setUsername(handle.username);
                setPlatform(handle.platform);
              }}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
