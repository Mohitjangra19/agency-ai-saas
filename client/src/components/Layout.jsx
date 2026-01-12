import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, BrainCircuit } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Clients', path: '/clients', icon: <Users size={20} /> },
        { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
        { name: 'AI Timeline', path: '/timeline', icon: <BrainCircuit size={20} /> },
    ];

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 text-white flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Vaisptech
                </h1>
                <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Project Management</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                <div>
                    <p className="text-sm font-medium">Vaisptech Solutions</p>
                    <p className="text-xs text-gray-500">Admin</p>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Sidebar />
            <div className="ml-64 p-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
