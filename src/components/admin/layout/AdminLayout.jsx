import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import HeaderAdmin from "./HeaderAdmin";

export default function AdminLayout() {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar - visible solo en grandes o si está abierto */}
            <aside
                className={`sidebar bg-light p-3 ${showSidebar ? "d-block" : "d-none d-md-flex"}`}
            >
                <NavAdmin />
            </aside>

            {/* Main content area */}
            <div className="flex-grow-1 d-flex flex-column">
                {/* Header con botón hamburguesa */}
                <HeaderAdmin toggleSidebar={toggleSidebar} />
                <main className="main-container flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
