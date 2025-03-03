// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = "http://localhost:3007";

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [postagens, setPostagens] = useState([]);

  // Cria o header de autorização (ajuste "Bearer" conforme o esperado pelo seu backend)
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  console.log("Token enviado:", token);
  console.log("Usuário autenticado:", user);

  useEffect(() => {
    // Só busca as postagens quando o usuário e token estiverem disponíveis
    if (!user || !user.id || !token) return;

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`, {
          headers: { ...authHeader }
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
  
    const fetchPostagens = async () => {
  try {
    console.log("Fazendo requisição para:", `${API_URL}/postagens?user_id=${user.id}`);
    console.log("Headers enviados:", authHeader);

    const response = await fetch(`${API_URL}/postagens?user_id=${user.id}`, {
      headers: { ...authHeader }
    });

    console.log("Código de resposta HTTP:", response.status);
    
    if (!response.ok) throw new Error('Erro ao buscar postagens');
    
    const data = await response.json();
    console.log("Postagens retornadas:", data);
    setPostagens(data);
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
  }
};


    fetchDashboard();
    fetchPostagens();
  }, [user, token, navigate, logout]);

  // Funções de CRUD
  const criarPostagem = async () => {
    if (!user || !user.id) return;
  
    const novaPostagem = {
      Users_id: user.id,
      titulo: "Nova Postagem",
      conteudo: "Conteúdo da postagem...",
      status: "publicado"
    };
  
    try {
      const response = await fetch(`${API_URL}/postagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(novaPostagem)
      });
  
      if (!response.ok) throw new Error('Erro ao criar postagem');
      
      const data = await response.json();
      // Atualiza o estado adicionando a nova postagem
      setPostagens(prev => [...prev, data]);
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  const editarPostagem = async (id) => {
    const postagemEditada = { titulo: "Título Editado", conteudo: "Novo conteúdo!" };
    
    try {
      const response = await fetch(`${API_URL}/postagens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(postagemEditada)
      });
  
      if (!response.ok) throw new Error('Erro ao editar postagem');
      
      setPostagens(prev =>
        prev.map(post => (post.id === id ? { ...post, ...postagemEditada } : post))
      );
    } catch (error) {
      console.error('Erro ao editar postagem:', error);
    }
  };

  const deletarPostagem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/postagens/${id}`, { 
        method: 'DELETE', 
        headers: { ...authHeader }
      });
  
      if (!response.ok) throw new Error('Erro ao excluir postagem');
      
      setPostagens(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Erro ao excluir postagem:', error);
    }
  };

  console.log("Estado atual de postagens:", postagens);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Bem-vindo à sua Área do Usuário</h2>
      <p>{message}</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/settings">Configurações</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>
      <button onClick={logout}>Sair</button>

      <div>
        <h2>Minhas Postagens</h2>
        <button onClick={criarPostagem}>Criar Nova Postagem</button>
        {/* Debug: exibe os dados brutos */}
        <pre>{JSON.stringify(postagens, null, 2)}</pre>
        <ul>
          {postagens.map(post => (
            <li key={post.id}>
              <strong>{post.titulo}</strong> <br />
              {post.conteudo} <br />
              <button onClick={() => editarPostagem(post.id)}>Editar</button>
              <button onClick={() => deletarPostagem(post.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
