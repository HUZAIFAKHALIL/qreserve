'use client';

import React, { useState, useEffect } from 'react';

export default function GenerateReportButton() {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Get userType from localStorage when the component mounts
    const storedUserType = localStorage.getItem('userRole');
    setUserType(storedUserType);
  }, []);

  const handleGenerateReport = async () => {
    if (userType !== 'ADMIN') {
      alert('You are not authorized to generate this report');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }), // Send user type to the API
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'system_report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('An error occurred while generating the report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerateReport} 
      disabled={loading || !userType}
      className={`
        px-6 py-3 
        rounded-lg 
        font-medium 
        text-sm 
        min-w-[200px]
        flex 
        items-center 
        justify-center 
        gap-2
        transition-all 
        duration-200
        ${loading || !userType 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-900 active:bg-gray-800 shadow-sm hover:shadow-md'
          }
      `}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading ? 'Generating...' : 'Generate Admin Report'}
    </button>
  );
}
