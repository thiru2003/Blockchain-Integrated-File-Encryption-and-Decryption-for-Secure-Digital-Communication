import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import DPNDashboard from './pages/DPNDashboard';
import EncryptionTool from './pages/EncryptionTool';
import SecureBrowsing from './pages/SecureBrowsing';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-10 h-10 text-cyan-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Secure DPN Platform
                </h1>
              </div>
              <h2 className="text-lg text-center text-gray-300 max-w-3xl">
                BLOCKCHAIN-INTEGRATED FILE ENCRYPTION AND DECRYPTION FOR SECURE DIGITAL COMMUNICATION
              </h2>
              <div className="flex space-x-6 mt-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/" 
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/encrypt" 
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  Encryption Tool
                </Link>
                <Link 
                  to="/secure-browsing" 
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  Secure Browsing
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DPNDashboard />} />
            <Route path="/encrypt" element={<EncryptionTool />} />
            <Route path="/secure-browsing" element={<SecureBrowsing />} />
          </Routes>
        </div>

        <footer className="bg-white/5 border-t border-white/10 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              Project by{' '}
              <span className="text-cyan-400">Vignesh D</span> and{' '}
              <span className="text-purple-400">Thirumukhil S P</span>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;