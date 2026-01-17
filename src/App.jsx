import React, { useState } from "react"
import {
  Search,
  MessageCircle,
  Share2,
  Users,
  Activity,
  Shield,
  Target,
  AlertTriangle,
  Smile,
  Bell,
} from "lucide-react"

const sampleTokens = [
  {
    id: "SOL",
    name: "Solana",
    mentions: 125000,
    sentiment: 72,
    totalReplies: 4500,
    totalRetweets: 9800,
    uniqueAuthors: 8200,
    loyaltyIndex: 68,
    organicGrowth: 12,
    botPercentage: 4,
    emotionData: [
      { emotion: "Joy", value: 55, color: "#60a5fa" },
      { emotion: "Anger", value: 8, color: "#fb7185" },
      { emotion: "Sadness", value: 7, color: "#94a3b8" },
      { emotion: "Surprise", value: 20, color: "#34d399" },
      { emotion: "Fear", value: 10, color: "#fbbf24" },
    ],
    competitors: [
      { name: "ETH", mentions: 210000, sentiment: 68, growth: -2.1 },
      { name: "BTC", mentions: 340000, sentiment: 62, growth: 1.8 },
    ],
    alerts: [
      { id: 1, severity: "high", title: "Spike in mentions", time: "2h ago", message: "Mentions increased 320% in last hour" },
      { id: 2, severity: "medium", title: "Negative sentiment rising", time: "5h ago", message: "Sentiment dropped by 15% in 24h" },
    ],
  },
  {
    id: "RUST",
    name: "RustToken",
    mentions: 24000,
    sentiment: 56,
    totalReplies: 480,
    totalRetweets: 300,
    uniqueAuthors: 210,
    loyaltyIndex: 54,
    organicGrowth: 6,
    botPercentage: 10,
    emotionData: [
      { emotion: "Joy", value: 35, color: "#60a5fa" },
      { emotion: "Anger", value: 15, color: "#fb7185" },
      { emotion: "Sadness", value: 8, color: "#94a3b8" },
      { emotion: "Surprise", value: 30, color: "#34d399" },
      { emotion: "Fear", value: 12, color: "#fbbf24" },
    ],
    competitors: [],
    alerts: [],
  },
]

export default function App() {
  const [tokens] = useState(sampleTokens)
  const [selectedId, setSelectedId] = useState(tokens[0].id)
  const [activeTab, setActiveTab] = useState("overview")

  const selectedToken = tokens.find((t) => t.id === selectedId) || tokens[0]

  return (
    <div className="app">
      <header className="header">
        <h1>Solana Mindshare Tracker</h1>
        <div className="search">
          <Search size={18} /> <input placeholder="Search tokens..." />
        </div>
      </header>

      <div className="content">
        <aside className="sidebar">
          <h3>Tokens</h3>
          <div className="token-list">
            {tokens.map((t) => (
              <button
                key={t.id}
                className={"token-card" + (t.id === selectedId ? " active" : "")}
                onClick={() => setSelectedId(t.id)}
              >
                <div className="token-name">{t.name}</div>
                <div className="token-mentions">{t.mentions.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="main">
          <section className="summary">
            <h2>{selectedToken.name}</h2>
            <div className="summary-row">
              <div className="stat card">
                <MessageCircle size={18} />
                <div className="stat-label">Replies</div>
                <div className="stat-value">{selectedToken.totalReplies.toLocaleString()}</div>
              </div>
              <div className="stat card">
                <Share2 size={18} />
                <div className="stat-label">Retweets</div>
                <div className="stat-value">{selectedToken.totalRetweets.toLocaleString()}</div>
              </div>
              <div className="stat card">
                <Users size={18} />
                <div className="stat-label">Authors</div>
                <div className="stat-value">{selectedToken.uniqueAuthors.toLocaleString()}</div>
              </div>
              <div className="stat card">
                <Activity size={18} />
                <div className="stat-label">Sentiment</div>
                <div className="stat-value">{selectedToken.sentiment}%</div>
              </div>
            </div>
          </section>

          <section className="cards">
            <div className="card">
              <Shield size={20} />
              <div className="card-label">Loyalty Index</div>
              <div className="card-value">{selectedToken.loyaltyIndex}%</div>
            </div>

            <div className="card">
              <Target size={20} />
              <div className="card-label">Organic Growth</div>
              <div className="card-value">{selectedToken.organicGrowth}%</div>
            </div>

            <div className="card">
              <AlertTriangle size={20} />
              <div className="card-label">Bot Activity</div>
              <div className="card-value">{selectedToken.botPercentage}%</div>
            </div>

            <div className="emotion card">
              <Smile size={18} />
              <div className="card-label">Emotion Analysis</div>
              <div className="emotion-grid">
                {selectedToken.emotionData.map((emotion, i) => (
                  <div key={i} className="emotion-item">
                    <div className="bar-outer">
                      <div
                        className="bar-inner"
                        style={{ height: `${emotion.value}%`, backgroundColor: emotion.color }}
                      />
                    </div>
                    <div className="emotion-name" style={{ color: emotion.color }}>
                      {emotion.emotion}
                    </div>
                    <div className="emotion-value">{emotion.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <nav className="tabs">
            <button onClick={() => setActiveTab("overview")} className={activeTab === "overview" ? "active" : ""}>Overview</button>
            <button onClick={() => setActiveTab("competition")} className={activeTab === "competition" ? "active" : ""}>Competition</button>
            <button onClick={() => setActiveTab("alerts")} className={activeTab === "alerts" ? "active" : ""}>Alerts</button>
          </nav>

          <section className="tab-content">
            {activeTab === "competition" && (
              <div>
                {selectedToken.competitors.length === 0 && <div className="card">No competitors data</div>}
                {selectedToken.competitors.map((comp, i) => (
                  <div key={i} className="comp card">
                    <div className="comp-name">{comp.name}</div>
                    <div className="comp-growth">{comp.growth >= 0 ? `↗ ${comp.growth}%` : `↘ ${comp.growth}%`}</div>
                    <div className="comp-stats">Mentions: {comp.mentions.toLocaleString()} · Sentiment: {comp.sentiment}%</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "alerts" && (
              <div>
                {selectedToken.alerts.length === 0 && <div className="card">No alerts</div>}
                {selectedToken.alerts.map((alert) => (
                  <div key={alert.id} className={"alert card " + (alert.severity === "high" ? "high" : "medium")}>{alert.title}</div>
                ))}
              </div>
            )}

            {activeTab === "overview" && (
              <div>
                <div className="card">Overview content for {selectedToken.name}</div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}