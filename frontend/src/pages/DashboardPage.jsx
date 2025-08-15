import React, { useState, useEffect } from 'react';
// Assuming your icons are exported from this file. Adjust path if needed.
import {
  IconChartBar,
  IconTrendingUp,
  IconAward,
  IconPlus,
  IconFileText,
  IconChevronRight,
} from '../components/icons';

// --- Sub-Components (defined within the same file) ---

const DashboardHeader = ({ name }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {name}!</h1>
            <p className="text-gray-400 mt-1">Here's a snapshot of your startup analysis activity.</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
            <IconPlus className="w-5 h-5" />
            New Analysis
        </button>
    </div>
);

const StatCard = ({ icon, title, value, color }) => {
    const colors = {
        blue: 'from-blue-500/20 to-gray-900 text-blue-400',
        green: 'from-green-500/20 to-gray-900 text-green-400',
        cyan: 'from-cyan-500/20 to-gray-900 text-cyan-400',
    };

    return (
        <div className={`bg-gray-800/50 bg-gradient-to-br ${colors[color]} p-6 rounded-2xl border border-gray-700/50 flex items-center space-x-4 transition-all duration-300 transform hover:scale-[1.03] hover:border-gray-500/80`}>
            <div className="bg-gray-800 p-4 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

const AnalysisTableRow = ({ analysis, getScoreColor }) => (
    <tr className="border-b border-gray-700/50 hover:bg-gray-800/60 transition-colors">
        <td className="p-4 font-medium text-white">{analysis.name}</td>
        <td className="p-4 text-gray-400 hidden md:table-cell">{analysis.date}</td>
        <td className="p-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getScoreColor(analysis.score).bg} ${getScoreColor(analysis.score).text}`}>
                {analysis.score}
            </span>
        </td>
        <td className="p-4 text-gray-300 hidden sm:table-cell">{analysis.risk}</td>
        <td className="p-4 text-right">
            <button className="text-blue-400 hover:text-white font-semibold text-sm flex items-center gap-1 ml-auto">
                View Report <IconChevronRight className="w-4 h-4" />
            </button>
        </td>
    </tr>
);

const EmptyState = () => (
    <div className="text-center py-16">
        <IconFileText className="mx-auto h-12 w-12 text-gray-500" />
        <h3 className="mt-2 text-lg font-semibold text-white">No Analyses Found</h3>
        <p className="mt-1 text-sm text-gray-400">Get started by running your first startup analysis.</p>
        <button className="mt-6 flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
            <IconPlus className="w-5 h-5" />
            New Analysis
        </button>
    </div>
);

const RecentAnalysesTable = ({ analyses }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return { bg: 'bg-green-500/10', text: 'text-green-400' };
        if (score >= 60) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
        return { bg: 'bg-red-500/10', text: 'text-red-400' };
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl">
            <h3 className="text-xl font-bold text-white p-6 border-b border-gray-700/50">Recent Analyses</h3>
            {analyses.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/40">
                            <tr className="text-sm text-gray-400">
                                <th scope="col" className="p-4 font-semibold">Startup Name</th>
                                <th scope="col" className="p-4 font-semibold hidden md:table-cell">Date</th>
                                <th scope="col" className="p-4 font-semibold">Score</th>
                                <th scope="col" className="p-4 font-semibold hidden sm:table-cell">Primary Risk</th>
                                <th scope="col" className="p-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {analyses.map(analysis => (
                                <AnalysisTableRow
                                    key={analysis.id}
                                    analysis={analysis}
                                    getScoreColor={getScoreColor}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 flex items-center space-x-4">
        <div className="bg-gray-700/50 p-4 rounded-xl w-16 h-16 animate-pulse"></div>
        <div className="flex-1 space-y-3">
            <div className="h-3 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

const SkeletonRow = () => (
    <tr className="border-b border-gray-700/50">
        <td className="p-4"><div className="h-4 bg-gray-700/50 rounded animate-pulse"></div></td>
        <td className="p-4 hidden md:table-cell"><div className="h-4 bg-gray-700/50 rounded animate-pulse"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse"></div></td>
        <td className="p-4 hidden sm:table-cell"><div className="h-4 bg-gray-700/50 rounded animate-pulse"></div></td>
        <td className="p-4"></td>
    </tr>
);

const DashboardSkeleton = () => (
    <div className="bg-gray-900 min-h-screen text-white">
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-2">
                    <div className="h-7 w-64 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="h-4 w-80 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-40 bg-gray-700/50 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl">
                <div className="h-12 p-6 border-b border-gray-700/50 w-48 bg-gray-700/50 rounded-t-lg animate-pulse"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);


// --- Main DashboardPage Component ---

// Mock function to simulate fetching data
const fetchUserData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Sumukh',
        stats: { totalAnalyses: 14, averageScore: 78, highestScore: 92 },
        recentAnalyses: [
          { id: 1, name: 'Innovatech AI', date: '2025-08-14', score: 92, risk: 'Market Competition' },
          { id: 2, name: 'GreenEats Delivery', date: '2025-08-12', score: 75, risk: 'Operational Scaling' },
          { id: 3, name: 'NextGen Robotics', date: '2025-08-11', score: 81, risk: 'Regulatory Hurdles' },
          { id: 4, name: 'HealthSphere', date: '2025-08-08', score: 55, risk: 'Product-Market Fit' },
        ],
      });
    }, 1500); // Simulate 1.5 second network delay
  });
};


const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData().then(data => {
      setUserData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="bg-gray-900 min-h-screen text-white">
        <div className="container mx-auto px-6 py-10">
            <DashboardHeader name={userData.name} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard
                    icon={<IconChartBar className="w-6 h-6" />}
                    title="Total Analyses"
                    value={userData.stats.totalAnalyses}
                    color="blue"
                />
                <StatCard
                    icon={<IconTrendingUp className="w-6 h-6" />}
                    title="Average Score"
                    value={userData.stats.averageScore}
                    color="green"
                />
                <StatCard
                    icon={<IconAward className="w-6 h-6" />}
                    title="Highest Score"
                    value={userData.stats.highestScore}
                    color="cyan"
                />
            </div>

            <RecentAnalysesTable analyses={userData.recentAnalyses} />
        </div>
    </main>
  );
};

export default DashboardPage;
