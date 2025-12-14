import React from "react";
import { useParams } from "react-router-dom";

export default function LegacyIframe() {
  const { page } = useParams();
  const src = `/legacy/${page || "Index.html"}`;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Legacy Page"
        src={src}
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}