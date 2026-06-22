import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const Create = () => {
    const { data, setData, post, processing } = useForm({
        name: "",
        description: "",
        status: "",
        start_date: "",
        end_date: ""
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/projects");
    };
    return (
        <DashboardLayout>
        <div>
            <h1>create project</h1>
            <Link href="/projects" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
                Back to Projects
            </Link>
            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
                <input type="text" name="name" placeholder="Project Name" value={data.name} onChange={e => setData('name', e.target.value)} className = "border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="text" name="description" placeholder="Project Description" value={data.description} onChange={e => setData('description', e.target.value)} className = "border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <select name="status" value={data.status} onChange={e => setData('status', e.target.value)} className = "border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                </select>
                <div className="flex gap-4 justify-between items-center">
                    <input type="date" name="start_date" placeholder="start date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className = "border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <input type="date" name="end_date" placeholder="end date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className = "border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="flex gap-4 justify-end">
                <Link href="/projects" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                </Link>
                <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    {processing ? "Creating..." : "Create Project"}
                </button>
                </div>
            </form>
        </div>
        </DashboardLayout>
    );
};

export default Create;