import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  // State to manage the current view: 'landing', 'form', 'result'
  const [currentView, setCurrentView] = useState('landing');
  // State to store the prediction result
  const [predictionResult, setPredictionResult] = useState(null);
  // State to show loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    setIsLoading(true); // Set loading to true
    setError(null); // Clear previous errors
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // If the response is not OK (e.g., 400, 500 status)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the prediction.');
      }

      const data = await response.json();
      setPredictionResult(data.prediction); // Assuming your backend returns { prediction: "..." }
      setCurrentView('result'); // Switch to result view
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // Function to reset the application to the landing page
  const resetApp = () => {
    setCurrentView('landing');
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {currentView === 'landing' && (
        <LandingPage onStart={() => setCurrentView('form')} />
      )}

      {currentView === 'form' && (
        <InputForm
          onSubmit={handleSubmit}
          onBack={() => setCurrentView('landing')}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentView === 'result' && (
        <ResultDisplay
          prediction={predictionResult}
          onReset={resetApp}
        />
      )}
    </div>
  );
}

export default App;
