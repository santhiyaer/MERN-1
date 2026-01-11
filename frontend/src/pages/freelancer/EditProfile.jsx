import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    skills: "",
    education: "",
    preferredSalary: "",
    languages: "",
    resumeHeadline: "",
    availableToJoin: "",
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/profile/me");
        const p = res.data;
        setForm({
          name: p.name || "",
          phone: p.phone || "",
          email: p.email || "",
          location: p.location || "",
          skills: (p.skills || []).join(", "),
          education: p.education || "",
          preferredSalary: p.preferredSalary || "",
          languages: (p.languages || []).join(", "),
          resumeHeadline: p.resumeHeadline || "",
          availableToJoin: p.availableToJoin || "",
        });
        if (p.profilePhoto) {
          setPreviewImage(p.profilePhoto.startsWith("http") ? p.profilePhoto : `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${p.profilePhoto}`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhotoFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k] || ""));

      if (profilePhotoFile) fd.append("profilePhoto", profilePhotoFile);
      if (resumeFile) fd.append("resume", resumeFile);

      const res = await api.put("/profile/me", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // normalize incoming profilePhoto/resume to absolute urls
      if (res.data.profilePhoto && !res.data.profilePhoto.startsWith("http")) {
        res.data.profilePhoto = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${res.data.profilePhoto}`;
      }
      if (res.data.resume && !res.data.resume.startsWith("http")) {
        res.data.resume = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}${res.data.resume}`;
      }

      localStorage.setItem("profilePhoto", res.data.profilePhoto || "");
      localStorage.setItem("userName", res.data.name || "");

      nav("/freelancer/view");
    } catch (err) {
      console.error("Update error", err);
      alert(err.response?.data?.message || err.message || "Error updating profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl mb-4">Edit Profile</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.name} onChange={e=>onChange("name", e.target.value)} placeholder="Full name" className="w-full border px-3 py-2 rounded" />
          <input value={form.phone} onChange={e=>onChange("phone", e.target.value)} placeholder="Phone" className="w-full border px-3 py-2 rounded" />
        </div>

        <input value={form.email} onChange={e=>onChange("email", e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input value={form.location} onChange={e=>onChange("location", e.target.value)} placeholder="City" className="w-full border px-3 py-2 rounded" />
        <input value={form.skills} onChange={e=>onChange("skills", e.target.value)} placeholder="Skills (comma separated)" className="w-full border px-3 py-2 rounded" />
        <input value={form.education} onChange={e=>onChange("education", e.target.value)} placeholder="Education" className="w-full border px-3 py-2 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.preferredSalary} onChange={e=>onChange("preferredSalary", e.target.value)} placeholder="Preferred Salary" className="w-full border px-3 py-2 rounded" />
          <input value={form.languages} onChange={e=>onChange("languages", e.target.value)} placeholder="Languages (comma separated)" className="w-full border px-3 py-2 rounded" />
        </div>

        <textarea value={form.resumeHeadline} onChange={e=>onChange("resumeHeadline", e.target.value)} placeholder="Resume Headline / About" className="w-full border px-3 py-2 rounded" rows={3} />

        <input value={form.availableToJoin} onChange={e=>onChange("availableToJoin", e.target.value)} placeholder="Available to join (e.g. 'In 2 weeks')" className="w-full border px-3 py-2 rounded" />

        <div>
          <label className="block mb-1">Profile Photo</label>
          <input type="file" accept="image/*" onChange={onPhotoChange} />
          {previewImage && <img src={previewImage} alt="preview" className="w-28 h-28 rounded-full object-cover mt-2 border" />}
        </div>

        <div>
          <label className="block mb-1">Resume (pdf/doc)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={onResumeChange} />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save Changes</button>
          <button type="button" onClick={()=>nav("/freelancer/dashboard")} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
