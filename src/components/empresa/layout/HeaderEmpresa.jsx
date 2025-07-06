// src/components/empresa/layout/HeaderEmpresa.jsx
import { Dropdown } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import CerrarSesion from "../../CerrarSesion";

export default function HeaderEmpresa({ toggleSidebar }) {
  const { userData } = useAuth();

  return (
    <header className="page-header d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white shadow-sm">
      <button
        className="btn btn-outline-secondary d-md-none"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      <div className="d-flex align-items-center gap-2 ms-auto">
        <span className="fw-semibold">{userData?.nombre}</span>
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" className="border-0">
            <FaUserCircle size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/empresa/perfil">
              <i className="bi bi-person me-2"></i> Editar perfil
            </Dropdown.Item>
            <Dropdown.Divider />
            <CerrarSesion />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
