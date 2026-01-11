import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Profile from "./pages/Profile";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import ViewProfile from "./pages/freelancer/ViewProfile";
import EditProfile from "./pages/freelancer/EditProfile";

import GigsList from "./pages/freelancer/GigsList";
import GigDetails from "./pages/freelancer/GigDetails";

import ClientDashboard from "./pages/client/ClientDashboard";
import PostGig from "./pages/client/PostGig";
import ClientGigList from "./pages/client/ClientGigList";
import ClientGigDetail from "./pages/client/ClientGigDetail";
import ProposalDetails from "./pages/client/ProposalDetails"; 



function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="p-6 bg-white rounded shadow">Welcome to GigConnect</div>
              }
            />
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
            <Route path="/freelancer/edit" element={<EditProfile />} />
            <Route path="/freelancer/view" element={<ViewProfile />} />
            <Route path="/gigs" element={<GigsList />} />
            <Route path="/gigs/:id" element={<GigDetails />} />

            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/post-gig" element={<PostGig />} />
            <Route path="/client/browse-gigs" element={<ClientGigList />} />
            <Route path="/client/gig/:id" element={<ClientGigDetail />} />
            <Route path="/client/proposal/:proposalId" element={<ProposalDetails />} />

            

          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
