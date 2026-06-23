import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";

const Index = ({ tasks }) => {
  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to delete the task "${title}"?`)) {
      router.delete(`/tasks/${id}`, {
        preserveScroll: true,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <Link
            href="/tasks/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition inline-block text-center"
          >
            Create New Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">No tasks found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-xl shadow-sm flex flex-col border border-gray-200 hover:shadow-md transition duration-200 h-72 justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={task.title}>
                    {task.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-50 text-yellow-500 border border-yellow-200 rounded-md uppercase tracking-wider">
                      {task.status}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-500 border border-blue-200 rounded-md uppercase tracking-wider">
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/tasks/${task.id}/edit`}
                      className="flex-1 text-center bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition"
                    >
                      Edit Task
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id, task.title)}
                      className="flex-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="text-xs text-gray-400 font-medium pt-1 border-gray-100 flex justify-between items-center">
                    <span>Created</span>
                    <span>{formatDate(task.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;