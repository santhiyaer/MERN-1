import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

function resolveImageUrl(photoValue) {
  if (!photoValue) return 'https://via.placeholder.com/160';
  if (typeof photoValue === 'string' && (photoValue.startsWith('http://') || photoValue.startsWith('https://'))) {
    return photoValue;
  }
  const base = (api.defaults?.baseURL || '').replace(/\/api$/, '') || (import.meta.env.VITE_API_URL || 'http://localhost:5001');
  return `${base}${photoValue && photoValue.startsWith('/') ? '' : '/'}${photoValue}`;
}

export default function ClientGigDetail(){
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
       
        setLoading(true);
         //  Fetch gig details
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);

      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.message || 'Failed to load gig');
      } finally {
        setLoading(false);
      }
    };
    if (id)load();
  }, [id]);


  const handleViewProposal = async (proposalId) => {
  try {
    const { data } = await api.get(`/proposals/${proposalId}`);
    if (data) {
      nav(`/client/proposal/${proposalId}`);
    } else {
      alert("Proposal not found");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to fetch proposal");
  }
};



  if (loading) return <div className="p-8">Loading gig...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;
  if (!gig) return <div className="p-8">Gig not found</div>;

  const proposals = gig.proposals || [];

  // image helpers
  const mainImg = resolveImageUrl(gig.photo || gig.image || gig.client?.profilePhoto);
  const clientImg = resolveImageUrl(gig.client?.profilePhoto);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* left/main */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-2xl p-8 border border-gray-100">

          {/* header: avatar + title */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={mainImg}
              alt={gig.title}
              className="w-24 h-24 rounded object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/160'; }}
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                <p className="text-gray-500 text-sm">
                  {gig.companyName || gig.client?.name}
                </p>
                {gig.title}
              </h2>

              <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
                <span className="inline-block w-4 h-4">★</span>
                <span className="text-gray-600">{gig.clientInfo?.rating ?? gig.rating ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* ...rest of component remains same (unchanged) */}
          <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-green-600">₹{gig.budget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-semibold text-gray-700 flex items-center justify-center gap-1">
                📍{gig.location || 'Remote'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Proposals</p>
              <p className="text-lg font-semibold text-gray-700">{gig.proposalsCount ?? proposals.length}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">{gig.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(gig.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* right side (unchanged) */}
        <aside className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About the Client</h3>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={clientImg}
              alt="Client"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/60'; }}
            />
            <div>
              <p className="font-medium text-gray-800">{gig.client?.name || 'Client'}</p>
              <p className="text-sm text-gray-500">⭐ {gig.clientInfo?.rating ?? gig.rating ?? '—'}</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span>Member since</span>
              <span className="font-medium text-gray-800">{gig.clientInfo?.memberSince || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total spent</span>
              <span className="font-medium text-gray-800">{gig.clientInfo?.totalSpent || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Jobs posted</span>
              <span className="font-medium text-gray-800">{gig.clientInfo?.jobsPosted || "-"}</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            Contact Client
          </button>
        </aside>

        {/* proposals section  */}
        <div className="md:col-span-2 mt-6 bg-white rounded-xl border p-6 shadow-sm lg:col-span-2">
          <h4 className="text-lg font-semibold mb-4">Proposals ({proposals.length})</h4>

          {proposals.length === 0 && <div className="text-gray-500">No proposals yet.</div>}

          {proposals.map(p => (
            <div key={p._id} className="border rounded-lg p-4 mb-4 flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <img
                  src={ resolveImageUrl(p.avatar || p.freelancer?.profilePhoto) }
                  alt={p.name || p.freelancer?.name || 'Freelancer'}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/48'; }}
                />
                <div>
                  <p className="font-semibold">{p.name || p.freelancer?.name || 'Freelancer'}</p>
                  <p className="text-sm text-gray-500">
                    ⭐ {p.freelancer?.rating ?? 4.8} · {p.freelancer?.completedJobs ?? 0} jobs completed
                  </p>
                  <p className="text-gray-600 mt-2">{p.coverLetter || 'No message provided.'}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-semibold">₹{p.amount ?? gig.budget}</p>
                <p className="text-gray-500 text-sm">in {p.days ?? "6"} days</p>
                <div className="flex gap-2 mt-3">

                  <button   onClick={() => handleViewProposal(p._id)} 
                  className="bg-blue-600 text-white px-3 py-1 rounded">View Proposal</button>
                  <Link to={`/messages/${p.freelancer?._id || p._id}`} className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">Message</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
