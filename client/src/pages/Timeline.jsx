import React, { useState } from 'react';
import { BrainCircuit, Clock, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

const Timeline = () => {
    const [projectDesc, setProjectDesc] = useState('');
    const [tasks, setTasks] = useState('');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPrediction(null);

        // Parse tasks (split by newline)
        const taskList = tasks.split('\n').filter(t => t.trim().length > 0);

        try {
            const response = await fetch(`${API_URL}/api/predict-timeline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectDescription: projectDesc,
                    tasks: taskList
                }),
            });
            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            console.error('Failed to get prediction', error);
            alert('Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BrainCircuit className="text-purple-500" size={32} />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        AI Timeline Predictor
                    </span>
                </h1>
                <p className="text-gray-400 mt-2">
                    Paste your specific tasks and let our AI estimate the completion date and risk factors.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Project Context</label>
                            <textarea
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                                rows="3"
                                placeholder="E.g. A fast-paced MVP for a fintech startup..."
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Task List (One per line)</label>
                            <textarea
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                                rows="8"
                                placeholder="1. Setup database schema&#10;2. Implement auth&#10;3. Design landing page..."
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit size={20} />
                                    Generate Prediction
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div>
                    {prediction ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold text-white">Analysis Result</h3>
                                <span className={`px - 3 py - 1 rounded - full text - xs font - semibold border ${prediction.riskFactor === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        prediction.riskFactor === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            'bg-green-500/10 text-green-400 border-green-500/20'
                                    } `}>
                                    {prediction.riskFactor} Risk
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-xs">Est. Days</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{prediction.estimatedDays} Days</p>
                                </div>
                                <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <CheckCircle size={16} />
                                        <span className="text-xs">Completion</span>
                                    </div>
                                    <p className="text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                        {new Date(prediction.completionDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-yellow-500" />
                                    AI Analysis
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {prediction.explanation}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-500">
                            <BrainCircuit size={48} className="mb-4 opacity-20" />
                            <p>Enter your tasks to receive an AI-powered project timeline estimation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
