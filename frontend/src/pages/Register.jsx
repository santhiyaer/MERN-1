import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function  Register(){
  const [role, setRole] = useState('client'); // default client
  const [form, setForm] = useState({});
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const onChange = (k,v) => setForm(prev => ({...prev, [k]: v}));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if(role==='client'){
        const res = await api.post('/register/client', {
          name: form.name,
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'client');
        localStorage.setItem('userName', res.data.user.name);
        nav('/client/dashboard');

      } else {

        const res = await api.post('/register/freelancer', {
          name: form.name,
          email: form.email, 
          password: form.password,  
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'freelancer');
        localStorage.setItem('userName', res.data.user.name);
        nav('/freelancer/dashboard');
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* LEFT - Form card */}
      <div>
        <div className="bg-white p-8 rounded shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create Your Account</h2>
          <p className="text-sm text-gray-500 mb-4">Join GigConnect and start connecting</p>

          <div className="flex gap-3 mb-4">
            <button onClick={()=>setRole('client')} className={`flex-1 py-2 rounded ${role==='client' ? ' bg-indigo-600 text-white' : 'bg-gray-100'}`}>Hire Talent</button>
            <button onClick={()=>setRole('freelancer')} className={`flex-1 py-2 rounded ${role==='freelancer' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Find Work</button>
          </div>

          {err && <div className="text-red-500 mb-2">{err}</div>}

          <form onSubmit={submit} className="space-y-3">
            <input onChange={e=>onChange('name', e.target.value)} placeholder="Full name" className="w-full border px-3 py-2 rounded" required/>
            <input onChange={e=>onChange('email', e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" type="email" required/>
            <input onChange={e=>onChange('password', e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" type="password" required/>

    

            <button className="w-full bg-gradient-to-r from-indigo-600 to-teal-400 text-white py-2 rounded">Create Account</button>
          </form>
        </div>
      </div>

      {/* RIGHT - Hero */}
      <div className="rounded overflow-hidden p-8" style={{background: 'linear-gradient(90deg,#2563EB,#14B8A6)'}}>
        <div className="text-white max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Start Your Journey</h2>
          <p className="mb-6">Whether you're looking to hire local talent or offer your skills, GigConnect makes it easy to connect and collaborate.</p>
          <div className="rounded overflow-hidden shadow">
            <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=..." alt="desk" className="w-full object-cover h-56"/>
          </div>
        </div>
      </div>
    </div>
  );
}
