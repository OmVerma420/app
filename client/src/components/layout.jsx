import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="no-print sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-grow container mx-auto max-w-7xl p-4 md:p-8">
        <Outlet />
      </main>
      <footer className="no-print bg-indigo-900 text-indigo-200 text-center text-xs md:text-sm p-4 mt-auto">
        © {new Date().getFullYear()} Gorelal Mehta College, Banmankhi, Purnea.
      </footer>
    </div>
  );
}
