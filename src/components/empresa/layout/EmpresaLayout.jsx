// src/components/empresa/layout/EmpresaLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavEmpresa from "./NavEmpresa";
import HeaderEmpresa from "./HeaderEmpresa";

export default function EmpresaLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="d-flex min-vh-100">
      <aside className={`sidebar bg-dark text-white p-3 ${showSidebar ? "d-block" : "d-none d-md-flex"}`}>
        <NavEmpresa />
      </aside>

      <div className="flex-grow-1 d-flex flex-column">
        <HeaderEmpresa toggleSidebar={toggleSidebar} />
        <main className="main-container flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
