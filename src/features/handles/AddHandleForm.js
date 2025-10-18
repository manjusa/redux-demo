// src/features/handles/AddHandleForm.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addHandle } from "./handlesSlice";

const PLATFORMS = ["twitter", "instagram", "facebook", "linkedin", "other"];

export default function AddHandleForm() {
  const dispatch = useDispatch();
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter a username");
      return;
    }
    dispatch(addHandle({ platform, username: trimmed }));
    setUsername("");
    setError(null);
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>
        Platform:
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 12, marginRight: 8 }}>
        Username:
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username (without @)"
          style={{ marginLeft: 8 }}
        />
      </label>

      <button type="submit" style={{ marginLeft: 12 }}>
        Add
      </button>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}
