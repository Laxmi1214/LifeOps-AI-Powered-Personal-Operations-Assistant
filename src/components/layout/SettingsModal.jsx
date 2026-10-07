import React, { useState } from 'react';
import { X, Server, Shield, Sparkles } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { showToast } = useLifeOps();
  const [activeTab, setActiveTab] = useState('mcp');
  const [mcpUrl, setMcpUrl] = useState('http://localhost:8080/mcp/stream');
  const [transport, setTransport] = useState('streamable-http');
  const [aiModel, setAiModel] = useState('claude-3-5-sonnet');
  const [proactivePlanning, setProactivePlanning] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    showToast('LifeOps operations settings saved', 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="text-sm font-semibold text-gray-900">Settings & MCP Engine</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-5 text-xs font-medium">
          {[
            { id: 'mcp', label: 'MCP & Integrations' },
            { id: 'ai', label: 'AI Copilot' },
            { id: 'security', label: 'Security' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 border-b-2 text-xs transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700">
          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  MCP Server Endpoint (Streamable HTTP)
                </label>
                <input
                  type="text"
                  value={mcpUrl}
                  onChange={(e) => setMcpUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Connects to the LifeOps tool server via Server-Sent Events (SSE).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Transport Protocol
                </label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="streamable-http">Streamable HTTP (SSE)</option>
                  <option value="stdio">Stdio Process Pipe (Local)</option>
                  <option value="websocket">WebSocket</option>
                </select>
              </div>

              <div className="pt-2">
                <div className="text-xs font-medium text-gray-800 mb-2">Connected Connectors</div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Google Calendar Connector', status: 'Mock Ready' },
                    { name: 'Gmail Intelligence Classifier', status: 'Mock Ready' },
                    { name: 'Personal Knowledge Vector Index', status: 'Connected' },
                    { name: 'Subscriptions & Bills Tracker', status: 'Active' }
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-2 rounded-md border border-gray-100 bg-gray-50/50">
                      <span className="text-gray-700">{c.name}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-100">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border border-gray-100 bg-gray-50/50">
                <div>
                  <div className="text-gray-900 font-medium">Proactive Scheduling</div>
                  <div className="text-[11px] text-gray-500">
                    Suggest focus blocks during calendar free windows.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={proactivePlanning}
                  onChange={(e) => setProactivePlanning(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md border border-gray-100 bg-gray-50/50 space-y-1">
                <div className="font-medium text-gray-900">Encrypted Local Vault</div>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Tokens and credentials are securely maintained in local OS keychain storage.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
