import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const schema = z.object({
  referenceId: z.string().min(1, 'Reference Id is required'),
  studentName: z.string().min(1, 'Name is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { student, status, error } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors }, setFocus } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { referenceId: '', studentName: '' },
  });

  useEffect(() => {
    setFocus('referenceId');
  }, [setFocus]);

  useEffect(() => {
    if (student) {
      const from = (location.state && location.state.from) || '/apply';
      navigate(from, { replace: true });
    }
  }, [student, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto max-w-2xl mt-10 p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-3">
            <h2 className="text-xl font-semibold">Apply For College Leaving Certificate</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
            <div>
              <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 mb-1">Reference Id <span className="text-red-500">*</span></label>
              <input id="referenceId" {...register('referenceId')} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              {errors.referenceId && <p className="text-sm text-red-600 mt-1">{errors.referenceId.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Graduation के Student Registration Number डालें</p>
            </div>

            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input id="studentName" {...register('studentName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              {errors.studentName && <p className="text-sm text-red-600 mt-1">{errors.studentName.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Name must be same as in Registration Card</p>
            </div>

            <div>
              <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                {status === 'loading' ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
