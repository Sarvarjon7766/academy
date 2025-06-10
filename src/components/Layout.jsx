import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ role }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto">
          {/* Outlet for rendering nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
