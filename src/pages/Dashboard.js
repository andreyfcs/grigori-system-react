// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const API_URL = "http://localhost:3007";

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [postagens, setPostagens] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem_url, setImagemUrl] = useState("");

  const authHeader = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  useEffect(() => {
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
        const response = await fetch(`${API_URL}/postagens?user_id=${user.id}`, {
          headers: { ...authHeader }
        });

        if (!response.ok) throw new Error('Erro ao buscar postagens');

        const data = await response.json();
        setPostagens(data);
      } catch (error) {
        console.error('Erro ao buscar postagens:', error);
      }
    };

    fetchDashboard();
    fetchPostagens();
  }, [user, token, navigate, logout, authHeader]);

  const criarPostagem = async () => {
    if (!user || !user.id) return;

    const novaPostagem = {
      Users_id: user.id,
      titulo,
      conteudo,
      categoria,
      imagem_url,
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
      setPostagens(prev => [...prev, data]);

      setTitulo("");
      setConteudo("");
      setCategoria("");
      setImagemUrl("");
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  const editarPostagem = async (id) => {
    const postagemEditada = { 
      titulo: "Título Editado",
      conteudo: "Novo conteúdo!"
    };

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

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo à sua Área do Usuário</h2>
      <p>{message}</p>
      <nav>
        <ul className="nav-list">
          <li><Link to="/settings">Configurações</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>
      <button onClick={logout}>Sair</button>

      <div className="posts-section">
        <h2>Minhas Postagens</h2>

        <div className="create-post-container">
          <h3>Criar Nova Postagem</h3>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Conteúdo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="textarea-field"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="URL da Imagem"
            value={imagem_url}
            onChange={(e) => setImagemUrl(e.target.value)}
            className="input-field"
          />
          <button onClick={criarPostagem}>Criar Nova Postagem</button>
        </div>

        <ul className="posts-list">
          {postagens.map(post => (
            <li key={post.id} className="post-item">
              <strong>{post.titulo}</strong>
              <br />
              <small>
                <i>
                  Autor: {post.autor || "Desconhecido"} | Categoria: {post.categoria || "Sem categoria"}
                </i>
              </small>
              <p>{post.conteudo}</p>
              {post.imagem_url && (
                <img src={post.imagem_url} alt="Imagem da postagem" className="post-image" />
              )}
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
