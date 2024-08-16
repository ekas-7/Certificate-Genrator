import { useState } from 'react';
import Form from './components/Form';
import Download from './components/Download';

export default function App() {
  const [pdfLink, setPdfLink] = useState('');
  // ok
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline">Generate Certificate</h1>
      <Form onGenerate={(link) => setPdfLink(link)} />
      {pdfLink && <Download pdfLink={pdfLink} />}
    </div>
  );
}