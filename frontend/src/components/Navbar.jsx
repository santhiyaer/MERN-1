import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [photo, setPhoto] = useState(localStorage.getItem("profilePhoto") || "");
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get("/profile/me");
        if (!isMounted) return;
        if (res?.data) {
          if (res.data.name) {
            setName(res.data.name);
            localStorage.setItem("userName", res.data.name);
          }
          if (res.data.role) {
            setRole(res.data.role);
            localStorage.setItem("role", res.data.role);
          }
          if (res.data.profilePhoto) {
            const p = res.data.profilePhoto.startsWith("http")
              ? res.data.profilePhoto
              : `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${res.data.profilePhoto}`;
            setPhoto(p);
            localStorage.setItem("profilePhoto", p);
          }
        }
      } catch (err) {
        console.error('Navbar profile load error', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const gigLink = role === "client" ? "/client/browse-gigs" : "/gigs";

  return (
    
    <header className="bg-blue-600 shadow text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-white">GigConnect</Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link to={gigLink} className="text-sm text-white hover:text-gray-200">Browse Gigs</Link>

          {name && (
            <Link
              to={role === "freelancer" ? "/freelancer/dashboard" : "/client/dashboard"}
              className="text-sm text-white hover:text-gray-200"
            >
              Dashboard
            </Link>
          )}

          {name ? (
            <div className="flex items-center gap-3">
              <div className="text-sm hidden sm:block">
                {name} <span className="text-xs text-gray-200">({role})</span>
              </div>

              <img
                src={photo || "/default-avatar.png"}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-white"
                onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                title={name}
              />

              {/* ✨ Improved Logout Button Styling */}
              <button
                onClick={logout}
                className="text-sm bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-white hover:text-gray-200">Login</Link>
              <Link to="/register" className="ml-2 px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100">Sign Up</Link>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {name ? (
            <img
              src={photo || "/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-white mr-2"
              onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
            />
          ) : null}

          <button onClick={() => setOpen(o => !o)} className="p-2 rounded-md text-white hover:bg-blue-500">
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-max-h duration-300 overflow-hidden bg-blue-600 border-t border-blue-700 ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="px-4 py-3 space-y-2">
          <Link to={gigLink} onClick={() => setOpen(false)} className="block text-white hover:text-gray-200">Browse Gigs</Link>

          {name && (
            <Link
              to={role === "freelancer" ? "/freelancer/dashboard" : "/client/dashboard"}
              onClick={() => setOpen(false)}
              className="block text-white hover:text-gray-200"
            >
              Dashboard
            </Link>
          )}

          {name ? (
            <div className="pt-2 border-t border-blue-500">
              <div className="flex items-center gap-3">
                <img
                  src={photo || "/default-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-white"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-gray-200">{role}</div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <Link to="/freelancer/view" onClick={() => setOpen(false)} className="block text-white hover:text-gray-200">View Profile</Link>
                <Link to="/freelancer/edit" onClick={() => setOpen(false)} className="block text-white hover:text-gray-200">Edit Profile</Link>
                
                {/* ✨ Mobile Logout Button Improved */}
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full text-left bg-white text-blue-600 font-medium rounded-md px-3 py-1 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-blue-500 flex gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="text-white hover:text-gray-200">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="ml-auto px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
