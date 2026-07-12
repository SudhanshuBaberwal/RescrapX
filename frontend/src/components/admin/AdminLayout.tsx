'use client';

import React, { useState } from 'react';
import Sidebar from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';
import Footer from '../footer/Footer';
import AdminPage from './AdminPage';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <Navbar onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1">
            <AdminPage />
          </main>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminLayout;