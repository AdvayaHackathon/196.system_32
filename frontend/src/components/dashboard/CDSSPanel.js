import React, { useState } from 'react';
import axios from 'axios';

function CDSSPanel({ patient }) {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/cdss/diagnose', {
        patientId: patient.id,
        symptoms: symptoms.split(',').map(s => s.trim())
      });
      setDiagnosis(response.data);
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
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
        >
          {loading ? 'Analyzing...' : 'Get Diagnosis'}
        </button>
      </form>

      {diagnosis && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Diagnosis:</h3>
          <ul className="list-disc list-inside">
            {diagnosis.conditions.map((condition, index) => (
              <li key={index}>{condition.name} ({condition.confidence}%)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CDSSPanel; 