import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-6 py-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} InvestIQ. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
