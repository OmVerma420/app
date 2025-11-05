import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProgressStepper from '../components/ProgressStepper';

export default function PaymentPage() {
  const navigate = useNavigate();
  const student = useSelector((s) => s.auth.student);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const feesAmount = 2.0;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    const paymentId = Math.random().toString(36).slice(2, 12).toUpperCase();
    try {
      await api.post('/applications/confirm-payment', { paymentId, paymentAmount: feesAmount });
      navigate('/application');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to confirm payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ProgressStepper currentStepIndex={1} />
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Apply Certificates Fees Payment</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium text-gray-600">Reference Id</span>
            <span className="font-mono text-gray-800">{student?.referenceId || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium text-gray-600">Student Name</span>
            <span className="font-medium text-gray-800">{student?.studentName || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium text-gray-600">Fees Amount</span>
            <span className="font-bold text-lg text-blue-700">₹ {feesAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <button onClick={() => navigate('/apply')} className="bg-gray-500 text-white py-2.5 px-6 rounded">Back</button>
          <button onClick={handlePayment} disabled={loading} className={`bg-blue-600 text-white py-2.5 px-6 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Processing...' : 'Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
