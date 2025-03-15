import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = "http://localhost:3006";

const Auth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegistering ? { name, email, password } : { email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isRegistering && data.token) {
          login(data.token);
          navigate('/dashboard');
        }
        alert(data.message);
      } else {
        throw new Error(data.message || 'Erro na operação');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>{isRegistering ? 'Registro' : 'Grigori'}</h2>
      
      {/* Alternador de Login/Registro */}
      <div style={{ marginBottom: '15px' }}>
      {/*  <button 
          onClick={() => setIsRegistering(false)} 
          style={{ marginRight: '5px', padding: '8px', backgroundColor: !isRegistering ? 'blue' : 'gray', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button> */}
      {/* <button 
          onClick={() => setIsRegistering(true)} 
          style={{ padding: '8px', backgroundColor: isRegistering ? 'blue' : 'gray', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registro
        </button> */}
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ display: 'block', margin: '5px auto', padding: '8px' }}
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', margin: '5px auto', padding: '8px' }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', margin: '5px auto', padding: '8px' }}
        />

        <button type="submit" style={{ marginTop: '10px', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isRegistering ? 'Registrar' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
