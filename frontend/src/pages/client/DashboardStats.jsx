export default function DashboardStats({ stats }) {
  // stats = { activeGigs, proposals, completedJobs }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Active Gigs</p>
          <p className="text-2xl font-semibold">{stats.activeGigs}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white">
          💼
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total Proposals</p>
          <p className="text-2xl font-semibold">{stats.proposals}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white">
          👥
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Completed Jobs</p>
          <p className="text-2xl font-semibold">{stats.completedJobs}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white">
          ✅
        </div>
      </div>
    </div>
  );
}
