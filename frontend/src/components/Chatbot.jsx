import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'bot', 
      text: "Hello! I'm your **InvestIQ Assistant Pro** 🚀\n\nI've loaded your complete investment portfolio and I'm ready to provide:\n\n• **Deep Analysis** - Compare startups, identify patterns\n• **Strategic Insights** - Risk assessment, portfolio optimization\n• **Market Intelligence** - Competitor analysis, trends\n• **Smart Recommendations** - Based on YOUR data\n\nWhat would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Fetch suggestions and stats when chat opens
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      fetchSuggestions();
      fetchQuickStats();
    }
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot/suggestions', {
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot/quick-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis && typeof data.analysis === 'object') {
          setStats(data.analysis);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendMessage = async (e, quickMessage = null) => {
    if (e) e.preventDefault();
    
    const messageToSend = quickMessage || message;
    if (!messageToSend.trim()) return;

    const userMessage = { 
      sender: 'user', 
      text: messageToSend,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ 
          message: messageToSend,
          history: chatHistory.slice(1) // Exclude initial greeting
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const botMessage = { 
        sender: 'bot', 
        text: data.reply,
        contextLoaded: data.contextLoaded,
        timestamp: new Date(),
        stats: data.stats
      };
      
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: '❌ Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        isError: true,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query) => {
    handleSendMessage(null, query);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.query) {
      handleSendMessage(null, suggestion.query);
    }
  };

  const formatMessage = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      // Handle headers (lines with **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${i}`} className="chat-list">{listItems}</ul>);
          listItems = [];
        }
        elements.push(
          <h4 key={i} className="chat-header">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
        return;
      }

      // Handle list items
      if (trimmed.match(/^[•\-\*]\s/)) {
        listItems.push(
          <li key={i} className="chat-list-item">
            {trimmed.replace(/^[•\-\*]\s*/, '')}
          </li>
        );
        return;
      }

      // Flush list items if we have any
      if (listItems.length > 0 && !trimmed.match(/^[•\-\*]\s/)) {
        elements.push(<ul key={`list-${i}`} className="chat-list">{listItems}</ul>);
        listItems = [];
      }

      // Handle bold text inline
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        const formatted = parts.map((part, idx) => 
          idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
        );
        elements.push(<p key={i} className="chat-paragraph">{formatted}</p>);
        return;
      }

      // Handle warnings/disclaimers
      if (trimmed.startsWith('⚠️') || trimmed.startsWith('⚡')) {
        elements.push(
          <div key={i} className="chat-warning">
            {trimmed}
          </div>
        );
        return;
      }

      // Regular paragraphs
      if (trimmed) {
        elements.push(<p key={i} className="chat-paragraph">{trimmed}</p>);
      } else {
        elements.push(<br key={i} />);
      }
    });

    // Flush remaining list items
    if (listItems.length > 0) {
      elements.push(<ul key="list-final" className="chat-list">{listItems}</ul>);
    }

    return elements;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const clearChat = () => {
    setChatHistory([chatHistory[0]]);
    setShowSuggestions(true);
  };

  // Enhanced quick actions
  const quickActions = [
    { 
      label: '📊 Portfolio Analysis', 
      query: 'Analyze my complete investment portfolio and show me key insights',
      icon: '📊'
    },
    { 
      label: '🎯 Best Opportunities', 
      query: 'Which are my best investment opportunities and why?',
      icon: '🎯'
    },
    { 
      label: '⚠️ Risk Assessment', 
      query: 'What are the biggest risks in my portfolio?',
      icon: '⚠️'
    },
    { 
      label: '📈 Market Trends', 
      query: 'What trends do you see in my analyses? Should I shift focus?',
      icon: '📈'
    },
    { 
      label: '💡 Next Steps', 
      query: 'What should I analyze or track next based on my data?',
      icon: '💡'
    },
    { 
      label: '🔍 Compare Startups', 
      query: 'Help me compare my analyzed startups side by side',
      icon: '🔍'
    },
  ];

  // Priority badge for suggestions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chat-window enhanced">
          {/* Enhanced Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-header-icon">🤖</div>
              <div>
                <h3>InvestIQ Assistant Pro</h3>
                <span className="chat-status">
                  ● Online • Context-Aware • Powered by Gemini 2.0
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button 
                onClick={clearChat} 
                className="chat-action-btn"
                title="Clear chat"
              >
                🗑️
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="chat-close-btn"
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stats Banner */}
          {stats && (
            <div className="chat-stats-banner">
              <div className="stat-item">
                <span className="stat-label">Analyses</span>
                <span className="stat-value">{stats.totalAnalyses || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Score</span>
                <span className="stat-value">{stats.avgScore || stats.avgSuccessScore || 0}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Best</span>
                <span className="stat-value">{stats.highestScore || stats.bestScore || 0}%</span>
              </div>
            </div>
          )}

          {/* Chat Body */}
          <div className="chat-body enhanced" ref={chatBodyRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="chat-avatar bot-avatar">
                    {msg.isError ? '⚠️' : '🤖'}
                  </div>
                )}
                <div className="chat-message-content">
                  <div className="message-text">
                    {formatMessage(msg.text)}
                  </div>
                  
                  {/* Message metadata */}
                  <div className="message-meta">
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                    {msg.contextLoaded && (
                      <span className="chat-context-badge">✓ Context loaded</span>
                    )}
                  </div>

                  {/* Message actions */}
                  {msg.sender === 'bot' && !msg.isError && (
                    <div className="message-actions">
                      <button 
                        className="action-btn"
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        title="Copy response"
                      >
                        📋
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => setExpandedMessage(expandedMessage === index ? null : index)}
                        title="Expand"
                      >
                        {expandedMessage === index ? '🔽' : '🔼'}
                      </button>
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="chat-avatar user-avatar">👤</div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="chat-message bot">
                <div className="chat-avatar bot-avatar">🤖</div>
                <div className="chat-message-content">
                  <div className="chat-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  {isTyping && (
                    <span className="typing-text">Assistant is analyzing...</span>
                  )}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {showSuggestions && suggestions.length > 0 && chatHistory.length <= 1 && (
              <div className="chat-suggestions enhanced">
                <p className="chat-suggestions-title">💡 Smart Insights for You:</p>
                {suggestions.map((sug, idx) => (
                  <div 
                    key={idx} 
                    className={`chat-suggestion-card ${getPriorityColor(sug.priority)}`}
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    <div className="suggestion-header">
                      <strong>{sug.title}</strong>
                      {sug.priority && (
                        <span className={`priority-badge ${getPriorityColor(sug.priority)}`}>
                          {sug.priority}
                        </span>
                      )}
                    </div>
                    <p>{sug.description}</p>
                    <div className="suggestion-type">{sug.type}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            {chatHistory.length <= 2 && !isLoading && (
              <div className="chat-quick-actions enhanced">
                <p className="chat-quick-title">⚡ Quick Actions:</p>
                <div className="chat-quick-grid">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      className="chat-quick-btn enhanced"
                      onClick={() => handleQuickAction(action.query)}
                    >
                      <span className="quick-icon">{action.icon}</span>
                      <span className="quick-label">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <form className="chat-footer enhanced" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your portfolio, startups, competitors, trends..."
                disabled={isLoading}
                className="chat-input enhanced"
              />
              {message && (
                <button
                  type="button"
                  className="clear-input-btn"
                  onClick={() => setMessage('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="chat-send-btn enhanced"
              title="Send message"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>

          <div className="chat-powered-by">
            🚀 Powered by Google Gemini 2.0 • Advanced AI Intelligence
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="chat-bubble enhanced"
          title="Open AI Assistant"
        >
          <span className="chat-bubble-icon">💬</span>
          <span className="chat-bubble-badge">Pro</span>
          <span className="chat-bubble-ping"></span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;