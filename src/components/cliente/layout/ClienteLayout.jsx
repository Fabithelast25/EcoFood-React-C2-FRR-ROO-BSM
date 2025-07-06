// src/components/cliente/layout/ClienteLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavCliente from "./NavCliente";
import HeaderCliente from "./HeaderCliente";

export default function ClienteLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar a la izquierda */}
      <aside className={`sidebar bg-dark text-white p-3 ${showSidebar ? "d-block" : "d-none d-md-flex"}`}>
        <NavCliente />
      </aside>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column">
        <HeaderCliente toggleSidebar={toggleSidebar} />
        <main className="main-container flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
