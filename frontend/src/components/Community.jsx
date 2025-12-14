import React, { useState, useEffect } from "react";

export default function Community() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/legacy/data/community_posts.json")
      .then(r => r.json())
      .then(data => setPosts(data))
      .catch(e => console.log("community_posts.json error", e));
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>👥 Communauté GlobalArtPro</h1>

      <div style={{ marginTop: "2rem" }}>
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <div key={idx} style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3>{post.title}</h3>
              <p><strong>{post.author}</strong> — {post.date}</p>
              <p>{post.content}</p>
              <button style={{ padding: "0.5rem 1rem", background: "#16c784", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Répondre
              </button>
            </div>
          ))
        ) : (
          <p>Chargement des discussions...</p>
        )}
      </div>
    </div>
  );
}