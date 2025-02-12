import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-5xl mx-auto p-2 sm:p-6 md:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
