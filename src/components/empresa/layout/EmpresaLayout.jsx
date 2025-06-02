import { Outlet } from "react-router-dom";
import NavEmpresa from "./NavEmpresa";
export default function EmpresaLayout() {
    return (
        <div>
            <NavEmpresa />
            <main className="container mt-3">
                <Outlet />
            </main>
        </div>
    );
}
