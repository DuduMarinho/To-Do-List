import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rota pública - Login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rota pública - Registro */}
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rota protegida - Home */}
              <Route 
                path="/home" 
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                } 
              />
              
              {/* Redirecionamento da raiz */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Rota não encontrada */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App; 