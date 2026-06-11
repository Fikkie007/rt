import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import Rumah from './pages/Rumah';
import Pembayaran from './pages/Pembayaran';
import Iuran from './pages/Iuran';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rumah" element={<Rumah />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/iuran" element={<Iuran />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;