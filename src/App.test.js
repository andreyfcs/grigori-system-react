import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


/* Primeira Pagina Auth by IA

import React, { useState } from "react";

const API_URL = "http://localhost:3001"; // URL base da sua API

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // Função para registrar um usuário
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro no registro");
    }
  };

  // Função para login e obtenção do token JWT
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        alert("Login bem-sucedido!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login");
    }
  };

  // Função para acessar o dashboard protegido
  const handleDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await response.json();
      setMessage(data.message || "Erro ao acessar o dashboard");
    } catch (error) {
      console.error("Erro ao acessar dashboard:", error);
      setMessage("Erro ao acessar o dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Registrar</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Entrar</button>
      </form>

      <h2>Dashboard</h2>
      <button onClick={handleDashboard} disabled={!token}>
        Acessar Dashboard
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;


*/