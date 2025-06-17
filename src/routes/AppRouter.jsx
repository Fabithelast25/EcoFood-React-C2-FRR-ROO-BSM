import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home"
import ProtectedRoute from './ProtectedRoute'
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from './ProtectedByRole';
import NotFound from "../pages/NotFound"

//Admin
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas"

//Empresa
import EmpresaLayout from "../components/empresa/layout/EmpresaLayout";
import EmpresaDashboard from "../pages/empresa/EmpresaDashboard";
import EmpresaPerfil from "../pages/empresa/PerfilEmpresa";
import EmpresaProducto from "../pages/empresa/Producto"

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar-password" element={<RecuperarContraseña />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/home" element={ 
                <ProtectedRoute> 
                    <Home /> 
                </ProtectedRoute> 
        }/>
        
            <Route path="/admin" element={
                <ProtectedByRole allowed={["admin"]}>
                    <AdminLayout/>
                </ProtectedByRole>
        }>
                <Route path="dashboard" element={<AdminDashboard/>} />
                <Route path="administradores" element={<AdminAdministradores/>} />
                <Route path="empresas" element={<AdminEmpresas/>} />
                <Route path="empresas" element={<AdminEmpresas/>} />
                <Route path="clientes" element={<AdminClientes/>} />
            </Route>

            <Route path="/empresa" element={
                <ProtectedByRole allowed={["empresa"]}>
                    <EmpresaLayout/>
                </ProtectedByRole>
            }>
                <Route path="dashboard" element={<EmpresaDashboard/>} />
                <Route path="producto" element={<EmpresaProducto/>} />
                <Route path="perfil" element={<EmpresaPerfil />} />
                
            </Route>
        </Routes>

    );
}
