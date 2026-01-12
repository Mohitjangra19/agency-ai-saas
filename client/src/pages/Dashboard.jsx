import React, { useEffect, useState } from 'react';
import { Users, Briefcase, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                {React.cloneElement(icon, { className: color })}
            </div>
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-white">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ clients: 0, projects: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Parallel fetch possible, but keeping it simple
            const clientsRes = await fetch('http://localhost:3000/api/clients');
            const clientsData = await clientsRes.json();

            const projectsRes = await fetch('http://localhost:3000/api/projects');
            const projectsData = await projectsRes.json();

            const tasksRes = await fetch('http://localhost:3000/api/tasks/pending-count');
            const tasksData = await tasksRes.json();

            setStats({
                clients: clientsData.length,
                projects: projectsData.length,
                pendingTasks: tasksData.count
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

    const cards = [
        { title: 'Total Clients', value: stats.clients, icon: <Users size={24} />, color: 'text-blue-500' },
        { title: 'Active Projects', value: stats.projects, icon: <Briefcase size={24} />, color: 'text-purple-500' },
        { title: 'Revenue (est)', value: '$12k', icon: <TrendingUp size={24} />, color: 'text-green-500' },
        { title: 'Pending Tasks', value: stats.pendingTasks || 0, icon: <AlertCircle size={24} />, color: 'text-orange-500' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Vaisptech Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Overview of your agency's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, idx) => (
                    <DashboardCard key={idx} {...stat} />
                ))}
            </div>

            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                <div className="flex gap-4">
                    <a href="/clients" className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors text-sm font-medium">Add Client</a>
                    <a href="/projects" className="px-4 py-2 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600/20 transition-colors text-sm font-medium">Create Project</a>
                    <a href="/timeline" className="px-4 py-2 bg-pink-600/10 text-pink-400 rounded-lg hover:bg-pink-600/20 transition-colors text-sm font-medium">AI Predictor</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
