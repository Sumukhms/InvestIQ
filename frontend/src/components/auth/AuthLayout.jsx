import React from 'react';

// You can replace this with your actual logo component if you have one
const AuthLogo = () => (
    <div className="flex items-center space-x-2 justify-center">
        <svg className="w-10 h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.44v4.8m5.96 7.13A14.98 14.98 0 0016.16 2.44m-5.84 7.38a14.98 14.98 0 00-3.32 7.13m3.32-7.13l-3.32 7.13m0 0a14.98 14.98 0 00-5.84-7.38m5.84 7.38l-5.84-7.38m5.84 7.38v4.8m-5.84-4.8v-4.8" />
        </svg>
        <span className="text-3xl font-bold text-white">Invest IQ</span>
    </div>
);


const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <AuthLogo />
        </div>
        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50">
            <h2 className="text-2xl font-bold text-center text-white mb-6">{title}</h2>
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
