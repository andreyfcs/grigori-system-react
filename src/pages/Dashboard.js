import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3001";

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: token }
        });
        
        if (response.status === 401) {
          logout();
          navigate('/');
          return;
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Erro no dashboard:', error);
      }
    };

    fetchDashboard();
  }, [token, navigate, logout]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Bem-vindo à sua Área do Usuário</h2>
      <p>{message}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default Dashboard;