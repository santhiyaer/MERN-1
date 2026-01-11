import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

// Resolve image urls from backend or absolute urls
function resolveImageUrl(photoValue) {
  if (!photoValue) return 'https://via.placeholder.com/120';
  if (photoValue.startsWith('http://') || photoValue.startsWith('https://')) return photoValue;
  const base = (api.defaults?.baseURL || '').replace(/\/api$/, '');
  return `${base}${photoValue.startsWith('/') ? '' : '/'}${photoValue}`;
}

export default function GigsList() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/gigs'); // assumes backend route GET /api/gigs
        if (mounted) setGigs(res.data || []);
      } catch (error) {
        console.error('fetchGigs error', error);
        setErr(error.response?.data?.message || error.message || 'Failed to load gigs');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchGigs();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-8">Loading gigs...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">Browse Gigs</h2>
      <div className="space-y-6">
        {gigs.map(g => (
          <div key={g._id} className="bg-white shadow rounded p-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex gap-4 items-start">
              <img
                src={resolveImageUrl(g.photo || g.image || g.companyLogo)}
                alt={g.title}
                className="w-20 h-20 rounded object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-lg">{g.title}</h3>
                <p className="text-sm text-gray-600">{g.companyName}</p>
                <p className="text-sm text-gray-500">🧩{g.location}</p>
                <p className="text-sm text-gray-700 mt-2">{(g.description || '').slice(0, 180)}{(g.description||'').length>160 ? '...' : ''}</p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-right md:text-right">
              <div className="text-green-600 font-semibold mb-3">₹{g.budget}</div>
              <Link to={`/gigs/${g._id}`} className="inline-block bg-indigo-600 text-white px-4 py-2 rounded">
                Apply
              </Link>
            </div>
          </div>
        ))}
        {gigs.length === 0 && <div className="text-gray-600">No gigs available yet.</div>}
      </div>
    </div>
  );
}
