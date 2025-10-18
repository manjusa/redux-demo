// src/features/handles/HandleList.js
import React from "react";
import { useSelector } from "react-redux";
import { selectAllHandles } from "./handlesSlice";
import HandleItem from "./HandleItem";

export default function HandleList() {
  const handles = useSelector(selectAllHandles);

  if (!handles || handles.length === 0) {
    return <div>No handles yet. Add one above.</div>;
  }

  return (
    <div>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {handles.map((h) => (
          <li key={h.id}>
            <HandleItem handle={h} />
          </li>
        ))}
      </ul>
    </div>
  );
}
