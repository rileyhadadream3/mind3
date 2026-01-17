import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Twitter, ExternalLink, Plus, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

function SolanaTokenTracker() {
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState({ name: "", address: "" });
  const [selectedToken, setSelectedToken] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      if (window.storage && window.storage.get) {
        const stored = await window.storage.get("solana-tokens");
        if (stored && stored.value) {
          setTokens(JSON.parse(stored.value));
          return;
        }
      }
      const ls = localStorage.getItem("solana-tokens");
      if (ls) setTokens(JSON.parse(ls));
    } catch (error) {
      console.log("No stored tokens found, starting fresh");
    }
  };

  const saveTokens = async (updatedTokens) => {
    try {
      if (window.storage && window.storage.set) {
        await window.storage.set("solana-tokens", JSON.stringify(updatedTokens));
      } else {
        localStorage.setItem("solana-tokens", JSON.stringify(updatedTokens));
      }
      setTokens(updatedTokens);
    } catch (error) {
      console.error("Failed to save tokens:", error);
    }
  };

  const generateMockMindshareData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      day,
      mentions: Math.floor(Math.random() * 1000) + 100,
      sentiment: Math.floor(Math.random() * 40) + 60,
    }));
  };

  const addToken = () => {
    if (!newToken.name || !newToken.address) return;

    const token = {
      id: Date.now(),
      name: newToken.name,
      address: newToken.address,
      addedAt: new Date().toISOString(),
      mindshareData: generateMockMindshareData(),
      totalMentions: Math.floor(Math.random() * 5000) + 500,
      weeklyGrowth: (Math.random() * 40 - 10).toFixed(1),
      sentiment: (Math.random() * 30 + 60).toFixed(1),
    };

    const updated = [...tokens, token];
    saveTokens(updated);
    setNewToken({ name: "", address: "" });
    setShowAddForm(false);
  };

  const removeToken = (id) => {
    const updated = tokens.filter((t) => t.id !== id);
    saveTokens(updated);
    if (selectedToken?.id === id) {
      setSelectedToken(null);
    }
  };

  const refreshData = (tokenId) => {
    const updated = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t,
          mindshareData: generateMockMindshareData(),
          totalMentions: Math.floor(Math.random() * 5000) + 500,
          weeklyGrowth: (Math.random() * 40 - 10).toFixed(1),
          sentiment: (Math.random() * 30 + 60).toFixed(1),
        };
      }
      return t;
    });
    saveTokens(updated);
    if (selectedToken?.id === tokenId) {
      setSelectedToken(updated.find((t) => t.id === tokenId));
    }
  };

  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="text-green-400" /> Solana Token Mindshare Tracker
          </h1>
          <p className="text-gray-300">Monitor token mentions and sentiment across X (Twitter)</p>
        </div>

        {/* Search and Add */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tokens by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Add Token
          </button>
        </div>

        {/* Add Token Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-white/10 border border-white/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Token</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Token Name (e.g., BONK)"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Contract Address"
                value={newToken.address}
                onChange={(e) => setNewToken({ ...newToken, address: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={addToken}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-colors"
              >
                Add Token
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredTokens.map((token) => (
            <div
              key={token.id}
              className="p-5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => setSelectedToken(token)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{token.name}</h3>
                  <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{token.address}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(token.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-1">
                    <Twitter size={16} /> Mentions
                  </span>
                  <span className="font-bold text-lg">{token.totalMentions.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">7d Growth</span>
                  <span className={`font-bold ${parseFloat(token.weeklyGrowth) >= 0 ? "text-green-400" : "text-red-400"}`}>{token.weeklyGrowth}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sentiment</span>
                  <span className="font-bold text-blue-400">{token.sentiment}%</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  refreshData(token.id);
                }}
                className="mt-4 w-full py-2 bg-purple-500/50 hover:bg-purple-500/70 rounded-lg text-sm font-semibold transition-colors"
              >
                Refresh Data
              </button>
            </div>
          ))}
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl mb-2">No tokens found</p>
            <p>Add a token to start tracking mindshare</p>
          </div>
        )}

        {/* Detailed View */}
        {selectedToken && (
          <div className="p-6 bg-white/10 border border-white/20 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedToken.name}</h2>
                <p className="text-gray-400 font-mono text-sm">{selectedToken.address}</p>
              </div>
              <button onClick={() => setSelectedToken(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-1">Total Mentions</p>
                <p className="text-3xl font-bold">{selectedToken.totalMentions.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-1">Weekly Growth</p>
                <p className={`text-3xl font-bold ${parseFloat(selectedToken.weeklyGrowth) >= 0 ? "text-green-400" : "text-red-400"}`}>{selectedToken.weeklyGrowth}%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-1">Sentiment Score</p>
                <p className="text-3xl font-bold text-blue-400">{selectedToken.sentiment}%</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Weekly Mentions</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={selectedToken.mindshareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="day" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                    <Line type="monotone" dataKey="mentions" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Sentiment Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedToken.mindshareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="day" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                    <Bar dataKey="sentiment" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> This demo uses simulated data. In a production environment, this would connect to X API and real-time Solana blockchain data to track actual mentions and token activity.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>;
}

export default function App() {
  return <SolanaTokenTracker />;
}