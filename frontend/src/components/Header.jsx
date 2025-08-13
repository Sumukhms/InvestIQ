import React from 'react';

// Footer component for the InvestIQ application
export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 text-gray-400 text-center p-8 border-t border-gray-800">
      <div className="container mx-auto max-w-5xl">
        <p className="text-lg font-semibold mb-4 text-gray-300">© 2025 InvestIQ. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-base md:text-lg mb-6">
          <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors duration-200">FAQ</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm md:text-base text-gray-500">
          <p className="mb-2"><strong>Spoorthi:</strong> 9742744250</p>
          <p className="mb-2"><strong>Srikanth:</strong> 8123054408</p>
          <p className="mb-2"><strong>Sumukh:</strong> 9480032940</p>
          <p className="mb-2"><strong>Varshini:</strong> 7411638543</p>
        </div>
        <div className="flex justify-center space-x-6 mt-8">
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
            {/* Facebook Icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
            {/* Twitter Icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 12 9.03c0 .34.04.67.1.99A12.13 12.13 0 0 1 3.15 5.1a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.28 4.28 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}