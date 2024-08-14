import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Form({ onGenerate }) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [pdfLink, setPdfLink] = useState(''); // Added to store the PDF link

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGenerated(false);
    try {
      const response = await axios.get('http://localhost:3000/api/getCertificate/generate', {
        params: { name, course, date }
      });
      const link = response.data.url;
      setPdfLink(link);
      onGenerate(link);
      setError('');
      setGenerated(true);
    } catch (error) {
      if (error.response && error.response.status === 503) {
        setError('Service is currently unavailable. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generated && pdfLink) {
      // Logic to handle after PDF is generated, e.g., trigger download
      // Automatically trigger download
      const link = document.createElement('a');
      link.href = pdfLink;
      link.download = 'certificate.pdf'; // Default file name
      link.click();
    }
  }, [generated, pdfLink]);

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Course</label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className={`p-2 rounded ${loading ? 'bg-gray-500' : generated ? 'bg-green-500' : 'bg-blue-500'} text-white`}
        disabled={loading}
      >
        {loading ? 'Generating...' : generated ? 'Download' : 'Generate PDF'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
