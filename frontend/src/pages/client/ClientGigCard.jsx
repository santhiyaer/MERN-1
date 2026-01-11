import React from "react";
import api from "../../services/api";

function resolveImageUrl(photoValue) {
  if (!photoValue) return 'https://via.placeholder.com/60';
  if (typeof photoValue === 'string' && (photoValue.startsWith('http://') || photoValue.startsWith('https://'))) return photoValue;
  const base = (api.defaults?.baseURL || '').replace(/\/api$/, '') || (import.meta.env.VITE_API_URL || 'http://localhost:5001');
  return `${base}${photoValue && photoValue.startsWith('/') ? '' : '/'}${photoValue}`;
}

export default function ClientGigCard({ gig, onView, onDelete }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-inner border border-gray-100 mb-6 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-4">
          <img
            src={
              resolveImageUrl(
                gig.photo ||
                (gig.client && gig.client.profilePhoto) ||
                ""
              )
            }
            alt="job"
            className="w-12 h-12 rounded object-cover"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/60'; }}
          />
          <div>
            <h3 className="text-lg font-semibold">{gig.title}</h3>
            <p className="text-sm text-gray-600">
              {gig.companyName || (gig.client && gig.client.name)}
            </p>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {gig.description?.slice(0, 180)}
          {(gig.description || "").length > 180 ? "..." : ""}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          <span> ₹ {gig.budget ?? "N/A"}</span> •{" "}
          <span>📍 {gig.location || "Remote"}</span>
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <button onClick={onView} className="px-4 py-2 bg-blue-600 text-white rounded">
          View
        </button>
        
        <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-700">
          Delete
        </button>
      </div>
    </div>     
  );
}
