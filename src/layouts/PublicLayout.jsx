import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "components/Shared/TopBar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;