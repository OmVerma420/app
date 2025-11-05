import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((s) => s.auth.student);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (e) {
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="w-full bg-indigo-900 text-white p-4 shadow-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4">
          {/*
            logo
          */}
          <img src="https://glmcollege.ac.in/assets/images/logo.png" alt="logo" className="h-12 w-12 object-contain" onError={(e)=>{e.target.style.display='none'}} />
          <div>
            <div className="text-lg font-bold">GORELAL MEHTA COLLEGE</div>
            <div className="text-sm text-indigo-200">BANMANKHI, PURNEA</div>
          </div>
        </Link>

        {student ? (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="font-medium capitalize">{student.studentName || 'Student'}</div>
              <div className="text-xs text-indigo-200">Ref: {student.referenceId || '-'}</div>
            </div>
            <Link to="/apply" className="bg-white text-indigo-900 px-3 py-1 rounded-md font-semibold hidden sm:inline">My Application</Link>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded-md text-white">Logout</button>
            <button onClick={()=>setOpen(v=>!v)} className="md:hidden p-2 rounded hover:bg-indigo-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className={({isActive})=> isActive ? 'text-white font-medium' : 'text-indigo-200 hover:text-white'}>Home</NavLink>
              <NavLink to="/login" className={({isActive})=> isActive ? 'text-white font-medium' : 'text-indigo-200 hover:text-white'}>Apply for Certificate</NavLink>
            </nav>
            <button onClick={()=>setOpen(v=>!v)} className="md:hidden p-2 rounded hover:bg-indigo-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </>
        )}
      </div>

      {open && !student && (
        <div className="md:hidden bg-indigo-800 border-t border-indigo-700">
          <div className="p-3 flex flex-col space-y-2">
            <Link to="/" onClick={()=>setOpen(false)} className="text-indigo-100">Home</Link>
            <Link to="/login" onClick={()=>setOpen(false)} className="text-indigo-100">Apply for Certificate</Link>
          </div>
        </div>
      )}
    </header>
  );
}
