import React from "react";
import Navbar, { Sidebar } from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen bg-gray-900 text-white font-funky tracking-widest">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}