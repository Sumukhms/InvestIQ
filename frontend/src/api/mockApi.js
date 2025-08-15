// This file simulates fetching data from a server.

export const mockUserData = {
    name: 'Arjun',
    stats: { totalAnalyses: 8, averageScore: 72, highestScore: 91 },
    recentAnalyses: [
        { id: 1, name: 'FintechFuture', date: '2025-08-12', score: 85, risk: 'Regulatory Hurdles' },
        { id: 2, name: 'AgriGrow AI', date: '2025-08-10', score: 91, risk: 'Supply Chain' },
        { id: 3, name: 'HealthSphere', date: '2025-08-09', score: 68, risk: 'High Competition' },
        { id: 4, name: 'EduVerse', date: '2025-08-05', score: 75, risk: 'Market Adoption' },
        { id: 5, name: 'EcoSolutions', date: '2025-07-28', score: 42, risk: 'Scalability' },
    ]
};

export const fetchUserData = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserData;
};
