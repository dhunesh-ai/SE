import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Calendar, Globe, ExternalLink, Tag } from 'lucide-react';

/**
 * ArticleDetailModal Component
 * Fetches and displays single news article by ID using GET /news/:id
 */
const ArticleDetailModal = ({ articleId, API_BASE_URL, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/news/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [articleId, API_BASE_URL]);

  if (!articleId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={20} color="#38bdf8" />
            <h2 className="modal-title">Article Details</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="state-container" style={{ padding: '3rem 1rem' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading article #{articleId}...</p>
          </div>
        ) : error ? (
          <div className="error-banner" style={{ margin: '1rem 0' }}>
            <p>{error}</p>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={onClose}>
              Close
            </button>
          </div>
        ) : article ? (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span className={`badge-category badge-tech`}>
                {article.category}
              </span>
              <span className="card-source" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                <Globe size={14} /> {article.source}
              </span>
              <span className="card-date" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                <Calendar size={14} /> {article.published}
              </span>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
              {article.title}
            </h1>

            <div style={{
              background: 'rgba(11, 15, 25, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.7
            }}>
              {article.summary || "No extended description provided for this article."}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Article ID: #{article.id}
              </span>
              
              {article.url ? (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  Visit Original Source <ExternalLink size={16} />
                </a>
              ) : (
                <button className="btn btn-secondary" onClick={onClose}>
                  Close Window
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ArticleDetailModal;
