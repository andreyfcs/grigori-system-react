import React from "react";
import { useAuth } from '../context/AuthContext';
import "./Sidebar.css";


const Sidebar = () => {

const { token, user, logout } = useAuth(); // Obtém autenticação do contexto

    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><a href="/dashboard">Início</a></li>
                <li><a href="/blog">Perfil</a></li>
                <li><a href="/settings">Configurações</a></li>
                <li><button onClick={logout}>Sair</button></li>
            </ul>
        </div>
    );
};

export default Sidebar;
