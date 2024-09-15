import React from 'react';

export default function FeedbackSupportPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Feedback and Support</h1>
      <p className="mb-4">We value your feedback and are here to support you. Please use the form below to submit your questions, suggestions, or concerns.</p>
      
      {/* Add a form or contact information here */}
      <div className="bg-card p-4 rounded-lg shadow">
        <p>For support, please email us at: <a href="mailto:ishaan.arakkal@gmail.com" className="text-blue-500 hover:underline">ishaan.arakkal@gmail.com</a></p>
      </div>
    </div>
  );
}