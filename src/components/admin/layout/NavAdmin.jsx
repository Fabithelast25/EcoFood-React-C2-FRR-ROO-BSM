import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";
import { Link } from "react-router-dom";

export default function NavAdmin() {
    const { userData } = useAuth();

    return (
        <div className="d-flex flex-column vh-100 sidebar sidebar-custom p-3">

            {/* Nombre o logo */}
            <h5 className="mb-4">Ecofood Administrador</h5>

            {/* Menú de navegación vertical */}
            <ul className="nav flex-column nav-pills mb-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/administradores">Administradores</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/empresas">Empresas</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/clientes">Clientes</Link>
                </li>
            </ul>

        </div>
    );
}
