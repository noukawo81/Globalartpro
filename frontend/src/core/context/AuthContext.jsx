/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import { api } from '@/services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [artistId, setArtistId] = useState(null);

  // On mount, load persisted auth state
  React.useEffect(() => {
    const token = localStorage.getItem('ga_token');
    if (token) api.setToken(token);
    try {
      const current = localStorage.getItem('currentUser');
      if (current) setUser(JSON.parse(current));
    } catch (e) { console.error('AuthContext: load currentUser error', e); }
    try {
      const stored = localStorage.getItem('artistId');
      if (stored && stored !== 'undefined' && stored !== 'null') setArtistId(stored);
    } catch (e) { console.error('AuthContext: load artistId error', e); }
  }, []);

  const login = (userData) => {
    const u = userData?.user || userData;
    if (u) {
      setUser(u);
      if (u.id) {
        setArtistId(String(u.id));
        try { localStorage.setItem('artistId', String(u.id)); } catch (e) { console.error('AuthContext: set artistId error', e); }
      }
      try { localStorage.setItem('currentUser', JSON.stringify(u)); } catch (e) { console.error('AuthContext: set currentUser error', e); }
    }
    // set token from userData (use canonical key `ga_token` only)
    const token = userData?.token || localStorage.getItem('ga_token');
    if (token) {
      api.setToken(token);
      try { localStorage.setItem('ga_token', token); } catch (e) { console.error('AuthContext: set token error', e); }
    }
  };
  const logout = () => {
    api.clearToken();
    setUser(null);
    setArtistId(null);
    try { localStorage.removeItem('currentUser'); } catch (e) { console.error('AuthContext: remove currentUser error', e); }
  }; 

  return (
    <AuthContext.Provider value={{ user, artistId, setArtistId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}