import React from "react";
import { useParams } from "react-router-dom";

export default function LegacyIframe() {
  const { page } = useParams();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={`/legacy/${page}.html`}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Legacy Content"
      />
    </div>
  );
}