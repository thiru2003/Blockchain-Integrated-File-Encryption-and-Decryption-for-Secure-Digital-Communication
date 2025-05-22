import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Upload, Download, Lock, Activity, Globe, MessageSquare, HardDrive, Cpu, Terminal, FileText } from 'lucide-react';
import { dpnService } from '../services/dpnService';
import type { ConnectionStatus, TransferProgress } from '../types';

function DPNDashboard() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    deviceId: null,
    networkType: null,
    peers: 0
  });

  const [transfer, setTransfer] = useState<TransferProgress>({
    status: 'pending',
    progress: 0
  });

  const [ipAddress, setIpAddress] = useState<string>('192.168.1.1');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [hardwareType, setHardwareType] = useState<'tplink' | 'attiny85' | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const validateIpAddress = (ip: string): boolean => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const connectToDPN = async () => {
    if (!validateIpAddress(ipAddress)) {
      setError('Please enter a valid IP address');
      return;
    }

    try {
      setError(null);
      setIsConnecting(true);
      const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
      await dpnService.initialize(deviceId, ipAddress);
      
      setStatus({
        isConnected: true,
        deviceId,
        networkType: 'dpn',
        peers: dpnService.getPeerCount()
      });
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleHardwareConnect = (type: 'tplink' | 'attiny85') => {
    setHardwareType(type);
    setShowPinDialog(true);
  };

  const handlePinSubmit = () => {
    const correctPin = hardwareType === 'tplink' ? '1230' : '3210';
    if (pin === correctPin) {
      setShowPinDialog(false);
      setPin('');
      setStatus(prev => ({
        ...prev,
        isConnected: true,
        networkType: hardwareType
      }));
    } else {
      setError('Invalid PIN');
    }
  };

  const simulateTransfer = () => {
    setTransfer({ status: 'transferring', progress: 0 });
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        setTransfer({ status: 'completed', progress: 100 });
      } else {
        setTransfer({ status: 'transferring', progress });
      }
    }, 500);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  const simulateTerminalCommand = () => {
    const commands = [
      'Initializing secure connection...',
      'Verifying hardware signature...',
      'Establishing encrypted tunnel...',
      'Running security checks...',
      'Connection established successfully!'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < commands.length) {
        setTerminalOutput(prev => [...prev, commands[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: currentUser.email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('uploadedFile', JSON.stringify(fileData));
      simulateTransfer();
    }
  };

  const handleFileDownload = () => {
    const fileData = JSON.parse(localStorage.getItem('uploadedFile') || '{}');
    if (fileData.uploadedBy && fileData.uploadedBy !== currentUser.email) {
      simulateTransfer();
      setTimeout(() => {
        alert(`File "${fileData.name}" downloaded successfully!`);
      }, 2000);
    } else {
      alert('No files available for download');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold">DPN Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className={`w-6 h-6 ${status.isConnected ? 'text-cyan-400' : 'text-gray-400'}`} />
            <span className="text-sm">
              {status.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">Security Status</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                Network Type: {status.networkType || 'Not Connected'}
              </p>
              <p className="text-sm text-gray-300">
                Device ID: {status.deviceId || 'Not Assigned'}
              </p>
              <p className="text-sm text-gray-300">
                Active Peers: {status.peers}
              </p>
              {status.isConnected && (
                <p className="text-sm text-gray-300">
                  Connected to: {dpnService.getSocketUrl()}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">Transfer Status</h2>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-cyan-500 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${transfer.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-300">
                Status: {transfer.status}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <div className="space-y-4">
              <div className="h-32 overflow-y-auto space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="bg-white/5 p-2 rounded">
                    {msg}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-cyan-500 px-3 py-1 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {!status.isConnected ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <HardDrive className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold">TP-Link Wired Hardware</h2>
                </div>
                <button
                  onClick={() => handleHardwareConnect('tplink')}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Connect to TP-Link
                </button>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold">ATTINY85 Wireless Hardware</h2>
                </div>
                <button
                  onClick={() => handleHardwareConnect('attiny85')}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Connect to ATTINY85
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-cyan-400" />
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => {
                    setIpAddress(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter DPN IP Address"
                  className={`flex-1 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} 
                           rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500`}
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={connectToDPN}
                  disabled={isConnecting}
                  className={`${isConnecting ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'} 
                           text-white px-6 py-2 rounded-lg transition-colors duration-200 
                           flex items-center space-x-2 disabled:cursor-not-allowed`}
                >
                  <Shield className="w-5 h-5" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect to DPN'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <button 
              onClick={simulateTransfer}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg 
                       transition-colors duration-200 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Send File</span>
            </button>
            <button 
              onClick={simulateTransfer}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg 
                       transition-colors duration-200 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Receive File</span>
            </button>
          </div>
        )}

        {showPinDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">Enter PIN</h3>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 mb-4"
                placeholder="Enter PIN"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPinDialog(false);
                    setPin('');
                  }}
                  className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">Command Terminal</h2>
        </div>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto">
          {terminalOutput.map((line, index) => (
            <div key={index} className="text-green-400">$ {line}</div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">File Transfer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload File</span>
            </button>
          </div>
          <div>
            <button
              onClick={handleFileDownload}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Files</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DPNDashboard;