import React from "react";
import Sidebar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen bg-gray-900 text-white font-funky tracking-widest flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}