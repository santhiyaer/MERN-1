import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function FreelancerDashboard() {
  const [profile, setProfile] = useState(null);
  const [applied, setApplied] = useState([]);

  // Helper to normalize image URL
  const resolveImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/120';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    return `${base}${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me'); // Get freelancer profile
        const p = res.data || {};

        // Fix photo URL if needed
        if (p.profilePhoto && !p.profilePhoto.startsWith('http')) {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:5001';
          p.profilePhoto = `${base}${p.profilePhoto}`;
        }

        setProfile(p);

        // Fetch applied gigs if freelancer ID exists
        if (p.appliedGigs && Array.isArray(p.appliedGigs)) {
          setApplied(p.appliedGigs);
        } else if (p._id) {
          const appliedRes = await api.get(`/freelancer/${p._id}/applied`);
          setApplied(appliedRes.data || []);
        } else {
          setApplied([]);
        }
      } catch (err) {
        console.error('Profile or Applied Gigs fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded shadow">
        <img
          src={profile.profilePhoto || 'https://via.placeholder.com/120'}
          alt=""
          className="w-32 h-32 rounded-full mx-auto object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/120';
          }}
        />
        <h3 className="text-center text-lg font-semibold mt-3">{profile.name}</h3>
        <p className="text-center text-sm text-gray-500">
          {profile.skills?.join(', ')}
        </p>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700">Status</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Completed Jobs: <strong>23</strong></li>
            <li>Total Earned: <strong>₹12,450</strong></li>
            <li>Profile Views: <strong>342</strong></li>
          </ul>
        </div>

        <Link
          to="/freelancer/edit"
          className="block mt-6 text-center bg-indigo-600 text-white py-2 rounded"
        >
          Edit Profile
        </Link>
        <Link
          to="/freelancer/view"
          className="block mt-3 text-center bg-indigo-600 text-white py-2 rounded"
        >
          View Profile
        </Link>
      </div>

      {/* Applied Gigs Section */}
      <div className="bg-white p-6 shadow rounded-lg mt-8 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Applied Gigs</h2>

        {applied.length === 0 ? (
          <p className="text-gray-500">No applied gigs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applied.map((gig, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 flex gap-4 items-start bg-gray-50 hover:shadow"
              >
                <img
                  src={resolveImageUrl(gig.photo || gig.image || gig.companyLogo)}
                  alt={gig.title}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{gig.title}</h3>
                  <p className="text-sm text-gray-600">{gig.companyName}</p>
                  <p className="text-sm text-gray-500">🧭 {gig.location || 'Remote'}</p>
                  <p className="text-green-600 font-medium mt-1">₹{gig.budget}</p>
                  <p className="text-gray-700 mt-2 text-sm">
                    {(gig.description || '').slice(0, 80)}
                    {gig.description?.length > 80 ? '...' : ''}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {/* Use gig.gigId (snapshot) or gig._id as fallback */}
                    <Link
                      to={`/gigs/${gig.gigId || gig._id}`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      View
                    </Link>

                    <Link
                      to={`/messages/gig-${gig.gigId || gig._id}`}
                      className="px-3 py-1 border rounded"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
