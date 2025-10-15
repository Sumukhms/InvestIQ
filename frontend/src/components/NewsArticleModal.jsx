// frontend/src/components/NewsArticleModal.jsx

import React from 'react';

const NewsArticleModal = ({ article, onClose }) => {
  if (!article) {
    return null;
  }

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-gray-800 text-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-400">{article.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-300">{article.full_content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsArticleModal;