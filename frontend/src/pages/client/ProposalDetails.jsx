import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";



function resolveImageUrl(val) {
  if (!val) return "https://via.placeholder.com/160";
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  const base = (api.defaults?.baseURL || import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/api$/, "");
  return `${base}${val.startsWith("/") ? "" : "/"}${val}`;
}

export default function ProposalDetails() {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [proposal, setProposal] = useState(null);
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
  const fetchProposal = async () => {
    if (!proposalId) return;
    try {
      setLoading(true);
      setErr("");

      const res = await api.get(`/proposals/${proposalId}`);
      setProposal(res.data.proposal);
      setFreelancer(res.data.freelancer); 
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.message || "Proposal not found");
    } finally {
      setLoading(false);
    }
  };

  fetchProposal();
}, [proposalId]);


  if (loading) return <div className="p-8">Loading...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;
  if (!proposal) return <div className="p-8">Proposal not found</div>;

  const f = freelancer || {};
  const avatar = resolveImageUrl(f.profilePhoto || f.avatar || proposal.avatar || "");
  const name = f.name || proposal.name || "Freelancer";
  const headline = f.resumeHeadline || proposal.resumeHeadline || "No headline provided";
  const cover = proposal.coverLetter || "No message provided.";
  const amount = proposal.amount ?? proposal.expectedSalary ?? proposal.budget ?? "—";
  const days = proposal.days ?? "N/A";
  const resumeUrl = f.resume || proposal.resume || "";
  const skills = f.skills || proposal.skills || [];
  const email = f.email || proposal.email || "N/A";
  const phone = f.phone || proposal.phone || "N/A";
  const education = f.education || proposal.education || "N/A";
  const languages = f.languages || proposal.languages || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://via.placeholder.com/160"; }}
          />  

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{name}</h2>
                <p className="text-sm text-gray-600 mt-1">{headline}</p>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-lg">₹{amount}</div>
                <div className="text-sm text-gray-500">in {days} days</div>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <p className="text-gray-700">{cover}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Skills</h4>
                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border rounded-full text-sm">{s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No skills listed</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Resume</h4>
                {resumeUrl ? (
                  <a href={resolveImageUrl(resumeUrl)} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download resume</a>
                ) : <p className="text-sm text-gray-500">No resume uploaded</p>}
              </div>
            </div>

            <div className="mt-4 bg-white border rounded p-4">
              <h4 className="font-semibold mb-2">Contact & Profile</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Phone:</strong> {phone}</div>
                <div><strong>Education:</strong> {education}</div>
                <div><strong>Languages:</strong> {languages.length ? languages.join(", ") : "N/A"}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/client/payment/${proposal._id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Payment 💳
              </button>

              <button
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to hire this freelancer?")) return;
                  try {
                    await api.post(`/gigs/proposals/${proposal._id}/hire`);
                    alert("Freelancer hired successfully!");
                    navigate("/client/dashboard");
                  } catch (e) {
                    console.error(e);
                    alert(e.response?.data?.message || "Failed to hire");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Hire Now 🚀
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
