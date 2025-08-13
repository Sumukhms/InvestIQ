import React from 'react';
import { IconChartBar, IconTrendingUp, IconAward } from '../components/icons';

const DashboardPage = ({ userData }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <main className="container mx-auto px-6 py-10">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-white">Welcome back, {userData.name}!</h2>
                <p className="text-gray-400 mt-1">Here's a snapshot of your startup analysis activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center space-x-4"><div className="bg-blue-500/10 p-3 rounded-lg text-blue-400"><IconChartBar /></div><div><p className="text-sm text-gray-400">Total Analyses</p><p className="text-2xl font-bold text-white">{userData.stats.totalAnalyses}</p></div></div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center space-x-4"><div className="bg-green-500/10 p-3 rounded-lg text-green-400"><IconTrendingUp /></div><div><p className="text-sm text-gray-400">Average Score</p><p className="text-2xl font-bold text-white">{userData.stats.averageScore}</p></div></div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center space-x-4"><div className="bg-cyan-500/10 p-3 rounded-lg text-cyan-400"><IconAward /></div><div><p className="text-sm text-gray-400">Highest Score</p><p className="text-2xl font-bold text-white">{userData.stats.highestScore}</p></div></div>
            </div>

            <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 mb-10">
                <h3 className="text-xl font-bold text-white mb-6">Recent Analyses</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-gray-700 text-sm text-gray-400"><th className="py-3 px-4 font-semibold">Startup Name</th><th className="py-3 px-4 font-semibold hidden md:table-cell">Date</th><th className="py-3 px-4 font-semibold">Score</th><th className="py-3 px-4 font-semibold hidden sm:table-cell">Primary Risk</th><th className="py-3 px-4 font-semibold"></th></tr></thead>
                        <tbody>
                            {userData.recentAnalyses.map(analysis => (
                                <tr key={analysis.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"><td className="py-4 px-4 text-white font-medium">{analysis.name}</td><td className="py-4 px-4 hidden md:table-cell">{analysis.date}</td><td className="py-4 px-4"><div className="flex items-center"><span className={`h-2.5 w-2.5 rounded-full ${getScoreColor(analysis.score)} mr-3`}></span><span className="text-white font-semibold">{analysis.score}</span></div></td><td className="py-4 px-4 hidden sm:table-cell">{analysis.risk}</td><td className="py-4 px-4 text-right"><button className="text-blue-400 hover:text-blue-300 font-semibold text-sm">View Report</button></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;