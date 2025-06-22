import { Outlet } from "react-router-dom";
import NavAdmin from "./NavCliente";
export default function ClienteLayout() {
    return (
        <div>
            <NavAdmin />
            <main className="container mt-3">
                <Outlet />
            </main>
        </div>
    );
}
