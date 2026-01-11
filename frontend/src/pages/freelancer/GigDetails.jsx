import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// small inline icons so you don't need lucide-react
function StarSVG(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.372 2.45a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.372-2.45a1 1 0 00-1.176 0l-3.372 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.287-3.966z" />
    </svg>
  );
}
function MapPinSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}

// helper to resolve relative image paths from backend to absolute URLs
function resolveImageUrl(photoValue) {
  if (!photoValue) return "https://via.placeholder.com/160";
  if (typeof photoValue === "string" && (photoValue.startsWith("http://") || photoValue.startsWith("https://")))
    return photoValue;
  const base = (api.defaults?.baseURL || "").replace(/\/api$/, "");
  return `${base}${photoValue && photoValue.startsWith("/") ? "" : "/"}${photoValue}`;
}

export default function GigDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // apply handler (sends gig info to backend and navigates)
  const handleApply = async () => {
    try {
      await api.post(`/gigs/${gig._id}/apply`, {
        gigId: gig._id,
        title: gig.title,
        companyName: gig.companyName || gig.client?.name,
        photo: gig.photo || gig.image || gig.client?.profilePhoto,
        budget: gig.budget,
        location: gig.location,
        description: gig.description,
      });
      alert("Applied — check your dashboard or messages");
      nav("/freelancer/dashboard");
    } catch (error) {
      console.error("apply error", error);
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/gigs/${id}`);
        if (mounted) setGig(res.data);
      } catch (error) {
        console.error("load gig error", error);
        setErr(
          error.response?.data?.message || error.message || "Failed to load gig"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-8">Loading gig...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;
  if (!gig) return <div className="p-8">Gig not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Left Section ---- */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-2xl p-8 border border-gray-100 transition hover:shadow-lg hover:-translate-y-0.5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={resolveImageUrl(gig.photo || gig.image || gig.companyLogo)}
              alt={gig.title}
              className="w-24 h-24 rounded-xl object-cover border border-gray-100 shadow-sm"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                <p className="text-gray-500 text-sm">{gig.companyName}</p>
                {gig.companyName}
              </h2>
              <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                <StarSVG className="inline w-4 h-4 text-yellow-400" />
                <span className="text-gray-600">{gig.rating || "4.8"}</span>
              </div>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{gig.budget}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-semibold text-gray-700 flex items-center justify-center gap-1">
                <MapPinSVG className="w-4 h-4 text-blue-500" />{" "}
                {gig.location || "Remote"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted On</p>
              <p className="text-lg font-semibold text-gray-700">
                {gig.date || "N/A"}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Job Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(gig.skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleApply}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Apply Now
            </button>
            <button
              onClick={() => nav("/gigs")}
              className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ---- Right Sidebar ---- */}
        <aside className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 h-fit transition hover:shadow-lg hover:-translate-y-0.5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            About the Client
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={gig.client?.profilePhoto || "https://via.placeholder.com/60"}
              alt="Client"
              className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
            />
            <div>
              <div className="font-medium text-gray-800">
                {gig.client?.name || "Client"}
              </div>
              <div className="text-sm text-gray-500">
                ⭐ {gig.client?.rating || 4.8}
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Contact / posted jobs etc.
          </p>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
            Contact Client
          </button>
        </aside>
      </div>
    </div>
  );
}
