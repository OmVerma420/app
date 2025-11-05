import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto max-w-5xl mt-10 p-4 space-y-8">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-gray-200 pb-2">Help Desk</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Phone & WhatsApp:</strong> 9534420627 (Time: 10:00 AM to 05:00 PM)</li>
            <li><strong>Email:</strong> glmcollegepu@gmail.com</li>
            <li className="text-red-600"><strong>Note:</strong> Apply करते समय सिर्फ एक ही बार का ऑनलाइन पेमेंट करें। If payment is taken and apply not complete, send Reference Id, name and payment id to college WhatsApp/email and wait 24 hours before retrying.</li>
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-gray-200 pb-2">Filling up the Certificate Apply Application</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>For fill Application Form, you must have a Mobile Number and Email Id.</li>
            <li>Click on <strong>Apply For Certificate</strong></li>
            <li>Click on <strong>Apply College Leaving Certificate</strong> or <strong>Apply Character Certificate</strong></li>
            <li>All fields marked with * are mandatory.</li>
            <li>The online process has multiple sections and a preview before printing.</li>
            <li>Payment options include cards, netbanking and UPI.</li>
          </ol>
        </div>

        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-gray-200 pb-2">Check Certificate Status</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click on <strong>Check Certificate Status</strong></li>
            <li>Login using Reference Number & Mobile No.</li>
          </ol>
        </div>

        <div className="flex justify-center py-6">
          <Link to="/login" className="bg-blue-600 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-md hover:bg-blue-700">
            Go to Apply Page
          </Link>
        </div>
      </main>
    </div>
  );
}
