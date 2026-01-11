import React from "react";
import { Search } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ title, count, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center gap-3 w-full sm:w-40">
    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white">
      {icon || <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div className="text-sm font-medium text-gray-800">{title}</div>
    <div className="text-xs text-gray-400">{count} gigs</div>
  </div>
);

export default function Home() {
  const categories = [
    { title: "Development", count: 234 },
    { title: "Design", count: 187 },
    { title: "Photography", count: 156 },
    { title: "Handyman", count: 298 },
    { title: "Content Writing", count: 143 },
    { title: "Business", count: 201 },
  ];
  const nav = useNavigate();

  const features = [
    { title: "Find Local Talent", desc: "Browse skilled freelancers in your area for quick, local projects." },
    { title: "Secure Payments", desc: "Escrow-based payment system ensures safe transactions for both parties." },
    { title: "Verified Profiles", desc: "Work with confidence knowing all profiles are verified and rated." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO  */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Find Local Freelancers Near You</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
              Connect with talented professionals in your area for short-term gigs. Post jobs, hire freelancers, or offer your services — all in one platform.
            </p>

            <form className="flex gap-3 items-center w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="flex items-center bg-white rounded-full px-4 py-2 w-full shadow-md">
                <Search className="text-gray-400" size={18} />
                <input
                  id="search"
                  placeholder="Search for services..."
                  className="flex-1 ml-3 outline-none bg-transparent text-gray-700"
                />
                <button type="submit" className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow">Search</button>
              </div>
            </form>

            <div className="mt-6 flex gap-3">
              <button onClick={()=>nav("/register")} className="bg-white text-blue-700 py-2 px-4 rounded">I'm a Client</button>
              <button onClick={()=>nav("/register")} className="border border-white/50 text-white py-2 px-4 rounded">I'm a Freelancer</button>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1d8b9d67b2b5bf6b7f758f3b4b5f3b0c"
                alt="workspace"
                className="w-full rounded-2xl shadow-2xl object-cover h-64 md:h-80 lg:h-96"
              />
            </div>
          </div>
        </div>
      </section>

     
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center text-2xl font-semibold mb-2">Browse by Category</h2>
        <p className="text-center text-gray-500 mb-8">Explore thousands of gigs across various categories</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.title} title={c.title} count={c.count} />
          ))}
        </div>
      </section>

      {/* section */}
      <section className="bg-white border-t border-b py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl font-semibold mb-2">Why Choose GigConnect?</h2>
          <p className="text-center text-gray-500 mb-8">Everything you need to hire or get hired</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl shadow-sm border p-6 h-full">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white mb-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  SECTION  */}
      <section className="mt-12 bg-gradient-to-r from-blue-600 to-teal-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Ready to Get Started?</h2>
          <p className="mb-6 text-white/90">Join thousands of clients and freelancers already using GigConnect</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/client/post-gig" className="inline-block bg-white text-blue-700 py-3 px-6 rounded-md font-medium">Post a Gig</a>
            <a href="/gigs" className="inline-block border border-white/60 text-white py-3 px-6 rounded-md font-medium">Browse Gigs</a>
          </div>
        </div>
      </section>

      
    </div>
  );
}
