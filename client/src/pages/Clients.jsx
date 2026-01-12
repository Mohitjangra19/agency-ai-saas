import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, ExternalLink, Mail, Building2 } from 'lucide-react';
import Modal from '../components/Modal';
import { API_URL } from '../config';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        industry: '',
        website: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_URL}/api/clients`);
            const data = await res.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchClients();
                setIsModalOpen(false);
                setFormData({ name: '', email: '', industry: '', website: '' });
            }
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Clients
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your client relationships and projects.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Add New Client
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 border border-dashed border-gray-800 rounded-xl">
                    <Users size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No clients found. Add your first client to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                    {client.name.charAt(0)}
                                </div>
                                <div className="flex gap-2">
                                    {client.website && (
                                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-colors">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Building2 size={14} />
                                <span>{client.industry || 'Tech'}</span>
                            </div>

                            <div className="border-t border-gray-800 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail size={14} />
                                    <span className="truncate">{client.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Client Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Client"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Acme Corp"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="contact@acme.com"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                            <input
                                type="text"
                                placeholder="e.g. Fintech"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.industry}
                                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                            <input
                                type="url"
                                placeholder="https://"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.website}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg mt-4 transition-colors"
                    >
                        Create Client
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
