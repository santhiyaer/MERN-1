import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [role, setRole] = useState('freelancer');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password, role });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.user.name);
      if (res.data.role === 'freelancer') nav('/freelancer/dashboard');
      else nav('/client/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="bg-white p-8 rounded shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-3">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-4">Sign in to your GigConnect account</p>

          <div className="flex gap-3 mb-4">
            <button onClick={()=>setRole('client')} className={`flex-1 py-2 rounded ${role==='client' ? 'bg-white border' : 'bg-gray-100'}`}>Client</button>
            <button onClick={()=>setRole('freelancer')} className={`flex-1 py-2 rounded ${role==='freelancer' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Freelancer</button>
          </div>

          {err && <div className="text-red-500 mb-2">{err}</div>}

          <form onSubmit={submit} className="space-y-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="you@example.com" />
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" placeholder="Password" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Forgot password?</div>
            </div>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-teal-400 text-white py-2 rounded">Sign In</button>
          </form>
        </div>
      </div>

      <div style={{background: 'linear-gradient(90deg,#2563EB,#14B8A6)'}} className="p-8 rounded">
        <div className="text-white max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Connect with Local Talent</h2>
          <p>Join thousands of professionals finding opportunities and growing their businesses on GigConnect.</p>
        </div>
      </div>
    </div>
  );
}


















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/login", formData);
//       // save token + user
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
//         >
//           Login
//         </button>
//       </form>
//       {message && <p className="mt-3 text-gray-600">{message}</p>}
//     </div>
//   );
// };

// export default Login;
