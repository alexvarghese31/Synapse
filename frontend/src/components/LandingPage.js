import React from 'react';

function LandingPage({ onStart }) {
  return (
    // Outer container: Ensures the page takes at least the full screen height.
    // Background is set to bg-gray-50 to match the preview image.
    // Removed padding from this outer div to eliminate any perceived "outer card" effect.
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Main content card: Made more rounded and adjusted vertical padding */}
      <div className="bg-white rounded-3xl shadow-lg max-w-3xl w-full py-10 px-12 text-center">
        {/* Brain icon SVG */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3v1.5M14.25 3v1.5M12 6v1.5M7.5 9v1.5M16.5 9v1.5M12 12v1.5M9 15v1.5M15 15v1.5M12 18v1.5M8.25 21h7.5a2.25 2.25 0 002.25-2.25v-1.5a6 6 0 00-12 0v1.5A2.25 2.25 0 008.25 21z"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Synapse</h1>
        <p className="text-gray-700 mb-10 px-6 text-lg">
          A simple and reliable tool to help you understand your risk of stroke based on your health information.
        </p>
        {/* Get Started Button: Made more rounded */}
        <button
          onClick={onStart}
          className="bg-blue-600 text-white font-semibold py-4 px-10 rounded-3xl shadow-lg transition duration-500 ease-in-out transform hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Get Started
        </button>
        <p className="text-xs text-gray-500 mt-12">
          * This tool is for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
