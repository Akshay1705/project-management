import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";

const Index = ({ projects }) => {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the project "${name}"?`)) {
            router.delete(`/projects/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Link href="/projects/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
                        Create New Project
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">{project.name}</h2>
                                <p className="text-gray-700 mb-2">{project.description}</p>
                                <p className="text-gray-500 text-sm mb-2">Status: {project.status}</p>
                                <p className="text-gray-500 text-sm mb-4">Start: {project.start_date} ---- End: {project.end_date}</p>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-4">
                                <Link
                                    href={`/projects/${project.id}/edit`}
                                    className="flex-1 text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-block"
                                >
                                    Edit Project
                                </Link>

                                <button
                                    onClick={() => handleDelete(project.id, project.name)}
                                    className="flex-2 bg-red-500 hover:bg-red-700 text-white text-center font-bold py-2 px-4 rounded-lg"
                                >
                                    Delete
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
