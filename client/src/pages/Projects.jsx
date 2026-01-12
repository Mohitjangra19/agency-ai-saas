import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Calendar, DollarSign, User } from 'lucide-react';
import Modal from '../components/Modal';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        name: '',
        client_id: '',
        description: '',
        budget: '',
        start_date: '',
        estimated_end_date: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, clientsRes] = await Promise.all([
                fetch('http://localhost:3000/api/projects'),
                fetch('http://localhost:3000/api/clients')
            ]);
            const projectsData = await projectsRes.json();
            const clientsData = await clientsRes.json();
            setProjects(projectsData);
            setClients(clientsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchData();
                setIsModalOpen(false);
                setFormData({
                    name: '', client_id: '', description: '', budget: '', start_date: '', estimated_end_date: ''
                });
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Projects
                    </h1>
                    <p className="text-gray-400 mt-1">Manage client projects and tasks.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-purple-500/20"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 border border-dashed border-gray-800 rounded-xl">
                    <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No projects found. Start a new project to get things moving.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors group cursor-pointer"
                            onClick={() => window.location.href = `/projects/${project.id}`}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{project.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full border ${project.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        project.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-gray-800 text-gray-400 border-gray-700'
                                    }`}>
                                    {project.status || 'pending'}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>{project.clients?.name || 'Unknown Client'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>Due: {project.estimated_end_date ? new Date(project.estimated_end_date).toLocaleDateString() : 'TBD'}</span>
                                </div>
                                {project.budget && (
                                    <div className="flex items-center gap-2 text-green-400/80">
                                        <DollarSign size={14} />
                                        <span>${project.budget}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Project"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Website Redesign"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Client</label>
                        <select
                            required
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.client_id}
                            onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                        >
                            <option value="">Select a Client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.start_date}
                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Est. End Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.estimated_end_date}
                                onChange={e => setFormData({ ...formData, estimated_end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Budget ($)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-lg mt-4 transition-colors"
                    >
                        Create Project
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
