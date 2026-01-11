import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function PostGig() {
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', form.title || '');
      fd.append('companyName', form.companyName || '');
      fd.append('location', form.location || '');
      fd.append('skills', form.skills || '');
      fd.append('budget', form.budget || '');
      fd.append('description', form.description || '');
      if (photo) fd.append('photo', photo);

      await api.post('/gigs/create', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      nav('/client/browse-gigs');
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.message || 'Error creating gig');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Post a Gig</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}

      <form
        onSubmit={submit}
        className="space-y-3 bg-white p-6 rounded-xl shadow-md border border-gray-100"
      >
        <input
          required
          placeholder="Title"
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          placeholder="Company name"
          onChange={(e) => onChange('companyName', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          placeholder="Location"
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          placeholder="Skills (comma separated)"
          onChange={(e) => onChange('skills', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          type="number"
          placeholder="Budget"
          onChange={(e) => onChange('budget', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <textarea
          placeholder="Job description"
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
          rows="5"
        />

        {/* Photo Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition">
          <label className="block mb-2 font-medium text-gray-700">
            Upload Company Logo / Gig Photo (optional)
          </label>
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 border rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="block text-sm text-gray-600 border border-gray-300 rounded-md cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => nav('/client/dashboard')}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
