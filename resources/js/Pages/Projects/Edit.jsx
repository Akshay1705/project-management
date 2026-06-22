import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, Link } from "@inertiajs/react";

const Edit = ({ project }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: project?.name || "",
        description: project?.description || "",
        status: project?.status || "",
        start_date: project?.start_date || "",
        end_date: project?.end_date || ""
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
                    <Link href="/projects" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
                        Back to Projects
                    </Link>
                </div>
                
                <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <input type="text" name="name" placeholder="Project Name" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <input type="text" name="description" placeholder="Project Description" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div>
                        <select name="status" value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                        </select>
                        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                    </div>

                    <div className="flex gap-4 justify-between items-center">
                        <div className="flex-1">
                            <input type="date" name="start_date" placeholder="start date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            {errors.start_date && <div className="text-red-500 text-xs mt-1">{errors.start_date}</div>}
                        </div>
                        <div className="flex-1">
                            <input type="date" name="end_date" placeholder="end date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            {errors.end_date && <div className="text-red-500 text-xs mt-1">{errors.end_date}</div>}
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                        {processing ? "Updating..." : "Update Project"}
                    </button>
                </form>
            </div> 
        </DashboardLayout>
    );
}

export default Edit;