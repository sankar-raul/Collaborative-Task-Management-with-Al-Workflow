export default function PromoForLogin() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-900 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">

          <h2 className="text-5xl font-serif text-white leading-tight">
            Smart Task Management for Modern Teams
          </h2>

          <p className="text-lg text-indigo-200">
            AI-powered task assignment, real-time collaboration,
            and intelligent workload balancing for maximum productivity.
          </p>

          {/* Mock Dashboard Card */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900">
                Today's Active Tasks
              </h3>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                4 In Progress
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Implement Authentication API
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Assigned to Rahul • High Priority
                </p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  WebSocket Integration
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Assigned to Debanjan • Medium Priority
                </p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  UI Dashboard Improvements
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Assigned to Sneha • Low Priority
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              ✓ Real-time updates • ✓ AI workload balancing • ✓ Role-based access
            </p>
          </div>
        </div>
      </div>
  )
}
