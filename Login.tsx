import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User } from 'lucide-react';

const users = [
  {
    name: 'Vignesh D',
    email: 'vd7327@srmist.edu.in',
    password: 'srmist@123'
  },
  {
    name: 'Thirumukhil S P',
    email: 'tp4082@srmist.edu.in',
    password: 'srmist@123'
  }
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <User className="w-12 h-12 text-cyan-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Login</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;