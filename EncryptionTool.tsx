import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, Download, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import CryptoJS from 'crypto-js';

interface EncryptionState {
  mode: 'text' | 'file';
  algorithm: 'random' | 'manual';
  input: string;
  key: string;
  result: string;
}

function EncryptionTool() {
  const [encryptionState, setEncryptionState] = useState<EncryptionState>({
    mode: 'text',
    algorithm: 'random',
    input: '',
    key: '',
    result: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setEncryptionState(prev => ({ ...prev, input: text }));
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  const handleEncrypt = () => {
    try {
      const key = encryptionState.algorithm === 'random' 
        ? CryptoJS.lib.WordArray.random(256/8).toString()
        : encryptionState.key;

      const encrypted = CryptoJS.AES.encrypt(encryptionState.input, key).toString();
      
      setEncryptionState(prev => ({
        ...prev,
        result: encrypted,
        key: key
      }));
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  const handleDecrypt = () => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptionState.input, encryptionState.key)
        .toString(CryptoJS.enc.Utf8);
      
      setEncryptionState(prev => ({
        ...prev,
        result: decrypted
      }));
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <Lock className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold">Encryption & Decryption Tool</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Encryption Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Lock className="w-6 h-6 text-purple-400" />
              <span>Encryption</span>
            </h2>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={encryptionState.algorithm === 'random'}
                    onChange={() => setEncryptionState(prev => ({ ...prev, algorithm: 'random' }))}
                    className="text-emerald-500"
                  />
                  <span>Random Algorithm</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={encryptionState.algorithm === 'manual'}
                    onChange={() => setEncryptionState(prev => ({ ...prev, algorithm: 'manual' }))}
                    className="text-emerald-500"
                  />
                  <span>Manual Key</span>
                </label>
              </div>

              {encryptionState.algorithm === 'manual' && (
                <input
                  type="text"
                  placeholder="Enter encryption key"
                  value={encryptionState.key}
                  onChange={(e) => setEncryptionState(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium">Enter Text to Encrypt</label>
                <textarea
                  value={encryptionState.input}
                  onChange={(e) => setEncryptionState(prev => ({ ...prev, input: e.target.value }))}
                  className="w-full h-32 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Enter text here..."
                />
              </div>

              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm text-gray-300">
                    {isDragActive
                      ? "Drop the files here..."
                      : "Drag 'n' drop files here, or click to select"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleEncrypt}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Lock className="w-5 h-5" />
                <span>Encrypt & Download</span>
              </button>
            </div>
          </div>

          {/* Decryption Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 text-blue-400" />
              <span>Decryption</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Decryption Key</label>
                <input
                  type="text"
                  placeholder="Enter decryption key"
                  value={encryptionState.key}
                  onChange={(e) => setEncryptionState(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Enter Encrypted Text</label>
                <textarea
                  value={encryptionState.result}
                  onChange={(e) => setEncryptionState(prev => ({ ...prev, input: e.target.value }))}
                  className="w-full h-32 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Enter encrypted text here..."
                />
              </div>

              <button
                onClick={handleDecrypt}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Decrypt</span>
              </button>
            </div>
          </div>
        </div>

        {encryptionState.result && (
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <p className="font-mono text-sm break-all">{encryptionState.result}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default EncryptionTool;