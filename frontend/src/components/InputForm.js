import React, { useState, useCallback, memo } from 'react';

// InputField component definition (consolidated and made sure value/onChange are used)
const InputField = memo(({ label, name, type = "text", options = null, required = true, value, onChange, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {options ? (
      <select
        id={name}
        name={name}
        value={value} // Pass value
        onChange={onChange} // Pass onChange
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value} // Pass value
        onChange={onChange} // Pass onChange
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
        {...props}
      />
    )}
  </div>
));

function InputForm({ onSubmit, onBack, isLoading, error, setIsLoading, setError }) { // Added setIsLoading, setError props
  // State to hold form data
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    hypertension: '',
    heart_disease: '',
    ever_married: '',
    work_type: '',
    Residence_type: '',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: '',
  });

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }, []);

  // Handle form submission - NOW INCLUDES API CALL TO NETLIFY FUNCTION
  const handleSubmit = async (e) => { // Made function async
    e.preventDefault();
    setIsLoading(true); // Set loading state
    setError(null); // Clear previous errors

    // Prepare data to send to the backend
    // Ensure all fields match the EXPECTED_FEATURES in your predict.py
    const dataToSubmit = {
      gender: formData.gender,
      age: parseFloat(formData.age), // Convert to number
      hypertension: parseInt(formData.hypertension), // Convert to integer
      heart_disease: parseInt(formData.heart_disease), // Convert to integer
      ever_married: formData.ever_married,
      work_type: formData.work_type,
      Residence_type: formData.Residence_type,
      avg_glucose_level: parseFloat(formData.avg_glucose_level), // Convert to number
      bmi: parseFloat(formData.bmi), // Convert to number
      smoking_status: formData.smoking_status,
    };

    try {
      // API call to your Netlify Function
      // The path is /.netlify/functions/ followed by your Python function file name (without .py)
      const response = await fetch('/.netlify/functions/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        // If the server response is not OK (e.g., 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed: Network response was not ok.');
      }

      const data = await response.json();
      // Call the onSubmit prop with the prediction result (which is 'prediction' key from backend)
      onSubmit(data.prediction);

    } catch (err) {
      console.error('Error during prediction:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Always set loading state to false after attempt
    }
  };

  // FormSection component definition (moved inside InputForm)
  const FormSection = ({ title, emoji, children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
          <span className="text-white text-lg">{emoji}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-5xl w-full py-10 px-16 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Health Assessment
            </h1>
            <p className="text-gray-600">Please provide your health information for stroke risk analysis</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-red-700 font-medium">Error occurred</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Personal Information */}
            <FormSection title="Personal Information" emoji="👤">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Gender"
                  name="gender"
                  value={formData.gender} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" }
                  ]}
                />
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age} // Pass value
                  onChange={handleChange} // Pass onChange
                  min="0"
                  max="120"
                  placeholder="Enter your age"
                />
                <InputField
                  label="Marital Status"
                  name="ever_married"
                  value={formData.ever_married} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "Yes", label: "Married" },
                    { value: "No", label: "Single" }
                  ]}
                />
                <InputField
                  label="Work Type"
                  name="work_type"
                  value={formData.work_type} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "Private", label: "Private Sector" },
                    { value: "Self-employed", label: "Self-employed" },
                    { value: "Govt_job", label: "Government Job" },
                    { value: "children", label: "Children" },
                    { value: "Never_worked", label: "Never Worked" }
                  ]}
                />
              </div>
            </FormSection>

            {/* Medical History */}
            <FormSection title="Medical History" emoji="❤️">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Hypertension"
                  name="hypertension"
                  value={formData.hypertension} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "0", label: "No" },
                    { value: "1", label: "Yes" }
                  ]}
                />
                <InputField
                  label="Heart Disease"
                  name="heart_disease"
                  value={formData.heart_disease} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "0", label: "No" },
                    { value: "1", label: "Yes" }
                  ]}
                />
              </div>
            </FormSection>

            {/* Lifestyle Information */}
            <FormSection title="Lifestyle & Environment" emoji="🏠">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Residence Type"
                  name="Residence_type"
                  value={formData.Residence_type} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "Urban", label: "Urban" },
                    { value: "Rural", label: "Rural" }
                  ]}
                />
                <InputField
                  label="Smoking Status"
                  name="smoking_status"
                  value={formData.smoking_status} // Pass value
                  onChange={handleChange} // Pass onChange
                  options={[
                    { value: "never smoked", label: "Never Smoked" },
                    { value: "formerly smoked", label: "Formerly Smoked" },
                    { value: "smokes", label: "Currently Smokes" },
                    { value: "Unknown", label: "Unknown" }
                  ]}
                />
              </div>
            </FormSection>

            {/* Health Metrics */}
            <FormSection title="Health Metrics" emoji="⚖️">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Average Glucose Level (mg/dL) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">💧</span>
                    <input
                      type="number"
                      name="avg_glucose_level"
                      value={formData.avg_glucose_level}
                      onChange={handleChange}
                      required
                      step="0.01"
                      placeholder="e.g., 120.5"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    BMI (Body Mass Index) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📏</span>
                    <input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleChange}
                      required
                      step="0.01"
                      placeholder="e.g., 24.5"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                ← Back to Home
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🔍</span>
                    Analyze Stroke Risk
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputForm;