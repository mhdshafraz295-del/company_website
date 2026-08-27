import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Security & SEO: Add noindex, nofollow for Admin portal pages
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
      created = true;
    }
    const originalContent = metaTag.content;
    metaTag.content = 'noindex, nofollow';

    return () => {
      if (created) {
        metaTag.remove();
      } else {
        metaTag.content = originalContent;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col lg:flex-row selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Sidebar Navigation */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
