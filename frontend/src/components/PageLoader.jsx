import React from 'react';

const LoadingSpinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>;

const PageLoader = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner />
    </div>
);

export default PageLoader;
