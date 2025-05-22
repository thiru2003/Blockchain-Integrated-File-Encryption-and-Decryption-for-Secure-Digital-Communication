import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Search } from 'lucide-react';

function SecureBrowsing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1230') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Secure Access Required</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthentication} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter secure access password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Access Secure Browsing</span>
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <Globe className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold">Secure Browsing</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">Hardware Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Hardware Connected</span>
              </div>
              <p className="text-sm text-gray-300">
                Encryption: AES-256-GCM
              </p>
              <p className="text-sm text-gray-300">
                Connection: Secure (TLS 1.3)
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">Security Features</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• DNS Protection Active</li>
              <li>• Malware Blocking Enabled</li>
              <li>• Phishing Protection On</li>
              <li>• Secure Routing Verified</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
          <iframe
            src="https://www.wikipedia.org/"
            className="w-full h-full border-0"
            title="Secure Browser"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SecureBrowsing;