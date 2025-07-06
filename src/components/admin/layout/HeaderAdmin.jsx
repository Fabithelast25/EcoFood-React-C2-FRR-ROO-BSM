import { Dropdown } from 'react-bootstrap';
import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";
import { Link } from "react-router-dom";
import logo from "../../../assets/img/logo.png"; // Ruta a la imagen

export default function HeaderAdmin({ toggleSidebar }) {
    const { userData } = useAuth();

    return (
        <header className="page-header">
            <div className="d-flex align-items-center gap-3">
                {/* Botón hamburguesa visible en móviles */}
                <button
                    className="btn btn-outline-secondary d-md-none"
                    onClick={toggleSidebar}
                >
                    <i className="bi bi-list fs-4"></i>
                </button>

                {/* Logo + texto */}
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={logo}
                        alt="EcoFood Logo"
                        className="logo-img"
                    />
                </div>
            </div>

            <Dropdown align="end">
                <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="d-flex align-items-center gap-2"
                >
                    <i className="bi bi-person-circle fs-4"></i>
                    <span>{userData?.nombre}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/admin/perfil">Editar Perfil</Dropdown.Item>
                    <Dropdown.Divider />
                    <div className="px-3">
                        <CerrarSesion />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </header>
    );
}
