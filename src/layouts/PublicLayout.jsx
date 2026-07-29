import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "components/Shared/TopBar";
import DevToolsGuard from 'components/Shared/DevToolsGuard';

const PublicLayout = () => {
  return (
    <DevToolsGuard>
      <TopBar />
      <Outlet />
    </DevToolsGuard>
  );
};

export default PublicLayout;