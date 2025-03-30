// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';  // importe a página de configurações
import Blog from './pages/Blog';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar'

function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* Agrupamos as rotas protegidas dentro de um layout flexível */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="content">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/blog" element={<Blog />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;
