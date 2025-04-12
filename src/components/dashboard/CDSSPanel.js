import React, { useState } from 'react';

function CDSSPanel({ patient }) {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulated API call
      const response = await fetch('/api/cdss/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          symptoms: symptoms.split(',').map(s => s.trim())
        }),
      });
      const data = await response.json();
      setDiagnosis(data);
    } catch (error) {
      console.error('CDSS Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter symptoms (comma-separated)"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Analyzing...' : 'Get Diagnosis'}
        </button>
      </form>

      {diagnosis && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Diagnosis Results:</h3>
          <ul className="list-disc list-inside">
            {diagnosis.conditions.map((condition, index) => (
              <li key={index} className="text-gray-700">
                {condition.name} ({condition.confidence}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CDSSPanel; 