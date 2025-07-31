import React, { useState } from 'react';
import LandingPage from './LandingPage.js'; // Assuming LandingPage is your initial component
import InputForm from './components/InputForm.js'; // Your InputForm component
import ResultDisplay from './components/ResultDisplay.js'; // Your ResultDisplay component

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'form', 'result'
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [error, setError] = useState(null); // New state for error messages

  const handleStartAnalysis = () => {
    setCurrentPage('form');
    setError(null); // Clear errors when navigating to form
  };

  const handleFormSubmit = (prediction) => {
    setPredictionResult(prediction);
    setCurrentPage('result');
  };

  const handleBackToForm = () => {
    setCurrentPage('form');
    setPredictionResult(null);
    setError(null); // Clear errors when going back
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    setPredictionResult(null);
    setError(null); // Clear errors when going back
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage onStartAnalysis={handleStartAnalysis} />
      )}

      {currentPage === 'form' && (
        <InputForm
          onSubmit={handleFormSubmit}
          onBack={handleBackToHome} // Or handleBackToLanding if you prefer
          isLoading={isLoading}
          error={error}
          setIsLoading={setIsLoading} // Pass the setter
          setError={setError}       // Pass the setter
        />
      )}

      {currentPage === 'result' && (
        <ResultDisplay
          prediction={predictionResult}
          onBack={handleBackToForm} // Or handleBackToForm if you want to re-enter data
        />
      )}
    </div>
  );
}

export default App;
