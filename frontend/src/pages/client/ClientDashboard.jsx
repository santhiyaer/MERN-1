import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardStats from "./DashboardStats";
import ClientGigCard from "./ClientGigCard";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [gigs, setGigs] = useState([]);
  const [stats, setStats] = useState({ activeGigs: 0, proposals: 0, completedJobs: 0 });
  const navigate = useNavigate();

  const fetchGigs = async () => {
    try {
      const res = await api.get("/gigs/me");
      setGigs(res.data || []);
      const active = (res.data || []).filter((g) => (g.status ? g.status === "active" : true)).length;
      const proposals = 0; //   compute if you have proposalsCount
      setStats({ activeGigs: active, proposals, completedJobs: 0 });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  // Handle gig delete
const handleDeleteGig = async (gigId) => {
  if (!window.confirm("Are you sure you want to delete this gig?")) return;

  try {
    await api.delete(`/gigs/${gigId}`);
    alert("Gig deleted successfully!");
    setGigs((prev) => prev.filter((g) => g._id !== gigId));
  } catch (error) {
    console.error("Delete gig error:", error);
    alert("Failed to delete gig. Try again.");
  }
};


  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-white flex items-center justify-center">
              GC
            </div>
            <h1 className="text-2xl font-semibold">Client Dashboard</h1>
          </div>
          <div>
            <button
              onClick={() => navigate("/post-gig")}
              className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-teal-400 text-white"
            >
              + Post New Gig
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <p className="text-gray-600 mb-4">Manage your gigs and proposals</p>
        <DashboardStats stats={stats} />

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Your Posted Gigs</h2>
          <p className="text-sm text-gray-500 mb-4">View and manage your job postings</p>

          {gigs.length === 0 ? (
            <div className="text-gray-500 py-8">No gigs posted yet.</div>
          ) : (
            gigs.map((g) => (
              <ClientGigCard
                key={g._id}
                gig={g}
                onView={() => navigate(`/client/gig/${g._id}`)}
                onDelete={() => handleDeleteGig(g._id)}
              />
            ))
          )}                
        </div>
      </div>
    </div>
  );
}
