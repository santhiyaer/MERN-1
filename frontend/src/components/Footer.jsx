import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-white flex items-center justify-center">
              GC
            </div>
            <span className="text-lg font-semibold">GigConnect</span>
          </div>
          <p className="text-sm text-gray-500">
            Connecting local talent with opportunities. Find your next gig or
            hire the perfect freelancer.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Clients</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-gray-800 cursor-pointer">Browse Freelancers</li>
            <li className="hover:text-gray-800 cursor-pointer">Post a Gig</li>
            <li className="hover:text-gray-800 cursor-pointer">How It Works</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Freelancers</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-gray-800 cursor-pointer">Find Gigs</li>
            <li className="hover:text-gray-800 cursor-pointer">Dashboard</li>
            <li className="hover:text-gray-800 cursor-pointer">Success Stories</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="hover:text-gray-800 cursor-pointer">About Us</li>
            <li className="hover:text-gray-800 cursor-pointer">Contact</li>
            <li className="hover:text-gray-800 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2025 GigConnect. All rights reserved.</div>

          <div className="flex items-center gap-4">
            {/* Decorative icons (no external links) */}
            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3c-2.5 0-4.5 2.31-4.5 5.16 0 .4.04.8.12 1.18A12.94 12.94 0 013 4s-4 9 5 13a13 13 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-1.02A7.72 7.72 0 0023 3z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
