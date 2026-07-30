import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Newspaper, Search, Plus, RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import NewsCard from './components/NewsCard';
import AddNewsModal from './components/AddNewsModal';
import ArticleDetailModal from './components/ArticleDetailModal';
import ThemeToggle from './components/ThemeToggle';

// Backend API URL - Default http://localhost:5000 or process.env configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const categories = ['All', 'Technology', 'Science', 'Business', 'Health', 'Sports', 'Entertainment'];

  /**
   * Fetch News Articles from Express Backend using Axios (GET /news)
   */
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await axios.get(`${API_BASE_URL}/news`, { params });
      setNews(response.data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(
        err.response?.data?.error || 
        'Failed to fetch news articles. Please ensure the backend server is running on http://localhost:5000.'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Trigger fetch on category or search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNews();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(timer);
  }, [fetchNews]);

  /**
   * Add New News Article using Axios (POST /news)
   */
  const handleAddNews = async (newArticleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/news`, newArticleData);
      // Refresh list
      fetchNews();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to publish news article');
    }
  };

  return (
    <div className="app-container">
      {/* Dashboard Top Header */}
      <header className="header">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Newspaper size={26} />
          </div>
          <div>
            <h1 className="brand-title">News Aggregator Dashboard</h1>
            <p className="brand-subtitle">Real-time headlines & cross-platform news feed</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Light / Dark Mode Toggle Button */}
          <ThemeToggle />

          <button 
            className="btn btn-secondary"
            onClick={fetchNews}
            disabled={loading}
            title="Refresh news feed"
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            Refresh
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            Publish Article
          </button>
        </div>
      </header>

      {/* Control Bar: Search Input & Category Filters */}
      <div className="control-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search news by title, keyword, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main>
        {/* Loading Indicator */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Fetching latest news articles...
            </p>
          </div>
        )}

        {/* Error State Banner */}
        {!loading && error && (
          <div className="error-banner">
            <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: '0.75rem' }} />
            <h3>Unable to Load News Feed</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchNews}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}

        {/* Empty Search / Filter State */}
        {!loading && !error && news.length === 0 && (
          <div className="state-container">
            <Layers size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Articles Found</h3>
            <p className="empty-state">
              No news articles match your current filter or search query.
            </p>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '1.25rem' }}
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* News Cards Grid */}
        {!loading && !error && news.length > 0 && (
          <div className="news-grid">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onViewDetail={(id) => setSelectedArticleId(id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add News Modal Dialog */}
      <AddNewsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNews={handleAddNews}
      />

      {/* Article Detail Modal Dialog */}
      <ArticleDetailModal
        articleId={selectedArticleId}
        API_BASE_URL={API_BASE_URL}
        onClose={() => setSelectedArticleId(null)}
      />
    </div>
  );
}

export default App;
