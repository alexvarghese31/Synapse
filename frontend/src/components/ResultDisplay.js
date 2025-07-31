import React from 'react';

function ResultDisplay({ prediction, onReset }) {
  // Determine the display message and styling based on the prediction
  const isStrokeLikely = prediction === 1; // Assuming 1 means stroke, 0 means no stroke

  const message = isStrokeLikely
    ? "Based on the provided data, there is a higher likelihood of stroke."
    : "Based on the provided data, there is a lower likelihood of stroke.";

  const cardClasses = isStrokeLikely
    ? "bg-red-100 border-red-400 text-red-700"
    : "bg-green-100 border-green-400 text-green-700";

  return (
    // Outer container with a subtle gradient background for elegance
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {/* Main content card: Increased roundedness and enhanced shadow */}
      <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full py-12 px-10 mx-auto text-center transform transition-all duration-300 ease-in-out hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Prediction Result</h2>

        {/* Prediction message card: More rounded corners and a subtle shadow */}
        <div className={`p-8 rounded-2xl border-l-4 ${cardClasses} mb-10 shadow-md transition-all duration-300 ease-in-out`}>
          <p className="text-xl font-semibold mb-2">{message}</p>
          {isStrokeLikely && (
            <p className="text-base mt-3 opacity-90">
              It is highly recommended to consult a medical professional for a comprehensive evaluation and personalized advice.
            </p>
          )}
        </div>

        {/* Action button: More rounded, enhanced hover effect, and a subtle icon */}
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 flex items-center justify-center mx-auto gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.125a.75.75 0 001.5 0V3a1 1 0 011-1h2a1 1 0 011 1v2.125a.75.75 0 001.5 0V3a1 1 0 011-1h2a1 1 0 011 1v2.125a.75.75 0 001.5 0V3a1 1 0 011-1h.25A2.75 2.75 0 0120 4.75v10.5A2.75 2.75 0 0117.25 18H2.75A2.75 2.75 0 010 15.25V4.75A2.75 2.75 0 012.75 2H3a1 1 0 011 1zm13.25 2.75a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zM12 4.75a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zM7 4.75a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 007 4.75z"
              clipRule="evenodd"
            />
          </svg>
          Make Another Prediction
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
