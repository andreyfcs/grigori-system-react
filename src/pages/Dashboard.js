import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
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
  const [imagens, setImagens] = useState([""]);

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
      imagens,
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
      setPostagens(prev => [...prev, { ...data, imagens }]);

      setTitulo("");
      setConteudo("");
      setCategoria("");
      setImagens([""]);
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  const adicionarImagem = () => {
    setImagens([...imagens, ""]);
  };

  const atualizarImagem = (index, valor) => {
    const novasImagens = [...imagens];
    novasImagens[index] = valor;
    setImagens(novasImagens);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo</h2>
      <p>{message}</p>

      <div className="posts-section">
        <h2>Minhas Postagens</h2>

        <div className="create-post-container">
          <h3>Criar Nova Postagem</h3>
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-field" />
          <textarea placeholder="Conteúdo" value={conteudo} onChange={(e) => setConteudo(e.target.value)} className="textarea-field" />
          <input type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-field" />
          <div className="image-inputs">
            {imagens.map((img, index) => (
              <div key={index} className="image-input-wrapper">
                <input type="text" placeholder="URL da Imagem" value={img} onChange={(e) => atualizarImagem(index, e.target.value)} className="input-field" />
                <button onClick={() => setImagens(imagens.filter((_, i) => i !== index))} className="remove-image">×</button>
              </div>
            ))}
          </div>
          <button onClick={adicionarImagem}>Adicionar Imagem</button>
          <button onClick={criarPostagem}>Criar Nova Postagem</button>
        </div>

        <ul className="posts-list">
          {postagens.map(post => (
            <li key={post.id} className="post-item">
              <strong>{post.titulo}</strong>
              <br />
              <small>
                <i>Autor: {post.autor || "Desconhecido"} | Categoria: {post.categoria || "Sem categoria"}</i>
              </small>
              <p>{post.conteudo}</p>
              {post.imagens && post.imagens.length > 0 && (
                <Slider {...sliderSettings} className="post-slider">
                  {post.imagens.map((img, idx) => (
                    <div key={idx}>
                      <img src={img} alt="Imagem da postagem" className="post-image" />
                    </div>
                  ))}
                </Slider>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
