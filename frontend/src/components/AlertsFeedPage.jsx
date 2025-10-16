import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration purposes
const mockAlerts = [
  {
    id: 1,
    competitor: 'Innovate Inc.',
    headline: 'Innovate Inc. raises $50M in Series B funding to expand AI platform.',
    summary: 'The funding round was led by Future Ventures and will be used to scale their engineering team and enter new European markets.',
    source: 'TechCrunch',
    date: '2025-10-14',
    link: '#',
  },
  {
    id: 2,
    competitor: 'NextGen Solutions',
    headline: 'NextGen Solutions launches a new predictive analytics tool for the logistics industry.',
    summary: 'The new tool aims to reduce shipping costs by 15% by optimizing routes in real-time, posing a direct challenge to established players.',
    source: 'VentureBeat',
    date: '2025-10-13',
    link: '#',
  },
    {
    id: 3,
    competitor: 'Innovate Inc.',
    headline: 'TechCrunch Disrupt Battlefield: Innovate Inc. named runner-up for its groundbreaking work in NLP.',
    summary: 'The company showcased a new natural language processing model that understands complex industry jargon with 98% accuracy.',
    source: 'TechCrunch',
    date: '2025-10-11',
    link: '#',
  },
];

const AlertsFeedPage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Competitor Alerts</h1>
        <Link 
          to="/competitor-setup" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Manage Competitors
        </Link>
      </div>

      {/* Filtering Controls */}
      <div className="mb-8">
        <span className="text-gray-400 mr-4">Filter by:</span>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full mr-2">All</button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full mr-2">Innovate Inc.</button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full">NextGen Solutions</button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {mockAlerts.map(alert => (
          <div key={alert.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-blue-300">{alert.headline}</h2>
            <p className="text-gray-400 mt-2">{alert.summary}</p>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div>
                <span className="font-bold">{alert.competitor}</span> via {alert.source}
              </div>
              <span>{alert.date}</span>
            </div>
            <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
              Read full article →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsFeedPage;