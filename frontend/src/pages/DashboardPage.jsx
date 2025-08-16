import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext'; // <-- Correctly added the import
import {
  IconChartBar,
  IconTrendingUp,
  IconAward,
  IconPlus,
  IconFileText,
  IconChevronRight,
} from '../components/icons';

// --- Sub-Components ---
const DashboardHeader = ({ name }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {name}!</h1>
            <p className="text-gray-600 mt-1">Here's a snapshot of your startup analysis activity.</p>
        </div>
        <Link to="/new-analysis" className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
            <IconPlus className="w-5 h-5" />
            New Analysis
        </Link>
    </div>
);

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg">
        <div className="bg-gray-100 p-4 rounded-xl">
            {React.cloneElement(icon, { className: "w-6 h-6 text-red-500" })}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const AnalysisTableRow = ({ analysis, getScoreColor }) => (
    <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900">{analysis.startupName}</td>
        <td className="p-4 text-gray-600 hidden md:table-cell">{new Date(analysis.createdAt).toLocaleDateString()}</td>
        <td className="p-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getScoreColor(analysis.successPercentage).bg} ${getScoreColor(analysis.successPercentage).text}`}>
                {analysis.successPercentage || 'N/A'}%
            </span>
        </td>
        <td className="p-4 text-gray-700 hidden sm:table-cell">{analysis.risks && analysis.risks.length > 0 ? analysis.risks[0].title : 'N/A'}</td>
        <td className="p-4 text-right">
            <Link to={`/analysis/${analysis._id}`} state={{ result: analysis }} className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1 ml-auto">
                View Report <IconChevronRight className="w-4 h-4" />
            </Link>
        </td>
    </tr>
);

const EmptyState = () => (
    <div className="text-center py-16">
        <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Analyses Found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by running your first startup analysis.</p>
        <Link to="/new-analysis" className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
            <IconPlus className="w-5 h-5" />
            New Analysis
        </Link>
    </div>
);

const RecentAnalysesTable = ({ analyses }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-800' };
        if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
        return { bg: 'bg-red-100', text: 'text-red-800' };
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200">Recent Analyses</h3>
            {analyses.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-sm text-gray-500">
                                <th scope="col" className="p-4 font-semibold">Startup Name</th>
                                <th scope="col" className="p-4 font-semibold hidden md:table-cell">Date</th>
                                <th scope="col" className="p-4 font-semibold">Score</th>
                                <th scope="col" className="p-4 font-semibold hidden sm:table-cell">Primary Risk</th>
                                <th scope="col" className="p-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analyses.map(analysis => (
                                <AnalysisTableRow
                                    key={analysis._id}
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

// --- Skeleton Loader Component (Restored and restyled for light theme) ---
const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4">
        <div className="bg-gray-200 p-4 rounded-xl w-16 h-16 animate-pulse"></div>
        <div className="flex-1 space-y-3">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

const SkeletonRow = () => (
    <tr className="border-b border-gray-200">
        <td className="p-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="p-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
        <td className="p-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="p-4"></td>
    </tr>
);

const DashboardSkeleton = () => (
    <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
            <div className="space-y-2">
                <div className="h-7 w-64 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-80 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl">
            <div className="p-6 border-b border-gray-200">
                 <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
            </div>
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
);

// --- Main DashboardPage Component ---
const DashboardPage = () => {
    const [analyses, setAnalyses] = useState([]);
    const [stats, setStats] = useState({ total: 0, average: 0, highest: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const res = await api.get('/analysis');
                setAnalyses(res.data);
                calculateStats(res.data);
            } catch (err) {
                setError('Failed to fetch analyses.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyses();
    }, []);

    const calculateStats = (data) => {
        if (data.length === 0) return;
        
        const total = data.length;
        const scores = data.map(a => a.successPercentage).filter(s => s != null);
        const average = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const highest = scores.length > 0 ? Math.max(...scores) : 0;

        setStats({ total, average, highest });
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <DashboardHeader name={user?.name || 'User'} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard icon={<IconChartBar />} title="Total Analyses" value={stats.total} />
                <StatCard icon={<IconTrendingUp />} title="Average Score" value={stats.average} />
                <StatCard icon={<IconAward />} title="Highest Score" value={stats.highest} />
            </div>

            <RecentAnalysesTable analyses={analyses} />
        </div>
    );
};

export default DashboardPage;
