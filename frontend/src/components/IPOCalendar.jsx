// frontend/src/components/IPOCalendar.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { IconAward, IconLoader } from './Icons';

const IPOCalendar = () => {
    const [ipos, setIpos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getIpos = async () => {
            try {
                const res = await api.get('/analysis/ipos');
                setIpos(res.data);
            } catch (error) {
                console.error("Failed to fetch IPOs", error);
            } finally {
                setIsLoading(false);
            }
        };
        getIpos();
    }, []);

    if (isLoading) {
        return <div className="bg-white p-6 rounded-2xl border flex items-center justify-center h-full"><IconLoader className="animate-spin w-6 h-6 text-gray-400" /></div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming IPOs</h3>
            <div className="space-y-4">
                {ipos.length > 0 ? ipos.map((ipo) => (
                    <div key={ipo.symbol || ipo.name} className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                            <IconAward className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{ipo.name}</p>
                            <p className="text-sm text-gray-600">
                                Expected: {ipo.date}
                            </p>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No major upcoming IPOs found.</p>}
            </div>
        </div>
    );
};

export default IPOCalendar;