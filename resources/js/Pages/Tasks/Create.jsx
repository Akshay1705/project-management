import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";

const CreateTask = ({ projects, users }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        project_id: "",
        assigned_user_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/tasks");
    };

    return (
        <DashboardLayout>
            <div className="max-w-md mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-6">Create Task</h1>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Task Title"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Task Description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={data.priority}
                            onChange={e => setData('priority', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {errors.priority && <div className="text-red-500 text-xs mt-1">{errors.priority}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="project_id">
                            Project
                        </label>
                        <select
                            name="project_id"
                            value={data.project_id}
                            onChange={e => setData('project_id', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select a Project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <div className="text-red-500 text-xs mt-1">{errors.project_id}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigned_user_id">
                            Assign To
                        </label>
                        <select
                            name="assigned_user_id"
                            value={data.assigned_user_id}
                            onChange={e => setData('assigned_user_id', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Unassigned</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.assigned_user_id && <div className="text-red-500 text-xs mt-1">{errors.assigned_user_id}</div>}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition"
                        >
                            {processing ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTask;