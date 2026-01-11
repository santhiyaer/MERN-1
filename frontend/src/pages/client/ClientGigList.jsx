import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";


function resolveImageUrl(photoValue) {
  if (!photoValue) return '/default-avatar.png';
  if (typeof photoValue === 'string' && (photoValue.startsWith('http://') || photoValue.startsWith('https://'))) return photoValue;
  const base = (api.defaults?.baseURL || '').replace(/\/api$/, '') || (import.meta.env.VITE_API_URL || 'http://localhost:5001');
  return `${base}${photoValue && photoValue.startsWith('/') ? '' : '/'}${photoValue}`;
}

export default function ClientGigList() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchGigs = async () => {
    try {
      const res = await api.get("/gigs");
      setGigs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter(
    (gig) =>
      gig.title?.toLowerCase().includes(search.toLowerCase()) ||
      gig.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      gig.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Search bar */}
        <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for gigs..."
            className="flex-1 outline-none bg-transparent text-gray-700"
          />
          <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-1.5 rounded-full">
            Search
          </button>
        </div>

        <p className="text-gray-600 mb-4">{filteredGigs.length} gigs found</p>

        {/* Gig cards */}
        {filteredGigs.map((gig) => {

          //  pick image from backend 
          const imageSrc =
            gig.photo ||
            gig.image ||
            gig.imageUrl ||
            gig.coverPhoto ||
            (gig.images && gig.images[0]) ||
            "/default-avatar.png";

          return (
            <Link
              key={gigs._id}
              to={`/client/gig/${gig._id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition p-5 mb-5"
            >
              <div className="flex flex-col sm:flex-row gap-4">

                {/* Image Section */}
                <div className="w-full sm:w-40 h-40 flex-shrink-0">
                  <img
                    src={resolveImageUrl(imageSrc)}
                     alt={gig.title || "Gig Image"}
                    className="w-full h-full object-cover rounded-md border"
                    onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                  />
                </div>

                {/* Text Section */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {gig.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {gig.companyName || gig.client?.name}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                        Active
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2 mb-3 line-clamp-3">
                      {gig.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 text-green-600">
                      ₹ {gig.budget || "N/A"}
                    </div>
                    <div className="flex items-center gap-1 text-blue-500">
                      📍 {gig.location || "Remote"}
                    </div>
                    <div className="text-gray-400 ml-auto">
                      {gig.proposalsCount || "No proposals"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {filteredGigs.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No gigs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
