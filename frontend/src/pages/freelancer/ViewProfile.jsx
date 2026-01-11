import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/profile/me");
        if (res.data) {

          // normalize absolute URLs for media if backend returns relative
          if (res.data.profilePhoto && !res.data.profilePhoto.startsWith("http")) {
            res.data.profilePhoto = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${res.data.profilePhoto}`;
          }
          if (res.data.resume && !res.data.resume.startsWith("http")) {
            res.data.resume = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${res.data.resume}`;
          }
          setProfile(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded p-6 shadow flex gap-6 items-center">
        <img src={profile.profilePhoto || "/default-avatar.png"} alt="" className="w-28 h-28 rounded-full object-cover border" />
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-600">{profile.location}</p>
          <p className="mt-2 text-sm">Skills: {(profile.skills || []).join(", ")}</p>
          <div className="mt-4 flex gap-2">
            <Link to="/freelancer/edit" className="px-4 py-2 bg-indigo-600 text-white rounded">Edit Profile</Link>
            <Link to="/freelancer/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded"> Back</Link>
            {profile.resume ? <a href={profile.resume} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded">Download Resume</a> : null}
          </div>
        </div>
      </div>

      <div className="bg-white rounded p-6 shadow mt-6">

        <h3 className="font-semibold mb-2">About</h3>
        <p>{profile.resumeHeadline || "—"}</p>

        <h3 className="font-semibold mt-4">Contact</h3>
        <p>Phone: {profile.phone || "—"}</p>
        <p>Email: {profile.email || "—"}</p>

        <h3 className="font-semibold mt-4">Languages</h3>
        <p>{(profile.languages || []).join(", ") || "—"}</p>

        <h3 className="font-semibold mt-4">Preferred Salary</h3>
        <p>{profile.preferredSalary || "—"}</p>

        <h3 className="font-semibold mt-4">Available to join</h3>
        <p>{profile.availableToJoin || "—"}</p>
      </div>
    </div>
  );
}
