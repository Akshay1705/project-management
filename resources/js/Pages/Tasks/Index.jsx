import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link, router} from "@inertiajs/react";

const Index = ({ tasks }) => {
    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete the task "${title}"?`)) {
            router.delete(`/tasks/${id}`, {
                preserveScroll: true,
            });
        }
    };
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-4">Tasks</h1>
                    <Link href="/tasks/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                        Create New Task
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col border h-48">
                            <div>
                                <h2 className="text-xl font-bold mb-2">{task.title}</h2>
                                <p className="text-gray-700 mb-4 line-clamp-2">{task.description}</p>
                            </div>
                            <div className="mt-auto flex justify-between">
                                <Link href={`/tasks/${task.id}/edit`} className="mt-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block">
                                    Edit Task
                                </Link>

                                <button
                                    onClick={() => handleDelete(task.id, task.title)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 "
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Index;