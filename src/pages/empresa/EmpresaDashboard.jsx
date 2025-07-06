import { useAuth } from "../../context/AuthContext";
import React from "react";

export default function EmpresaDashboard() {
    const { userData } = useAuth();

    return (
        <div style={{ padding: "2rem" }}>
            <h2>
                Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""} al Panel de Empresa
            </h2>
        </div>
    );
}
