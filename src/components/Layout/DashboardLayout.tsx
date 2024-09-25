import React, { ReactNode } from "react";
import Sidebar from "../Dashborad/Sidebar";
// import Navbar from "../Dashborad/Navbar";

// Define the props type
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Navbar /> */}
        <main className="container-fluid p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
