import React from 'react';
import { Calendar, Globe, ArrowRight } from 'lucide-react';

/**
 * NewsCard Component
 * Displays individual news item with category badge, title, source, and published date.
 */
const NewsCard = ({ article, onViewDetail }) => {
  // Utility function to get category-specific badge styling
  const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology': return 'badge-tech';
      case 'science': return 'badge-science';
      case 'business': return 'badge-business';
      case 'health': return 'badge-health';
      case 'sports': return 'badge-sports';
      default: return 'badge-default';
    }
  };

  return (
    <div className="news-card">
      <div>
        <div className="card-top">
          <span className={`badge-category ${getCategoryClass(article.category)}`}>
            {article.category}
          </span>
          <span className="card-source">
            <Globe size={14} />
            {article.source}
          </span>
        </div>

        <h3 className="card-title">{article.title}</h3>

        {article.summary && (
          <p className="card-summary">{article.summary}</p>
        )}
      </div>

      <div className="card-footer">
        <span className="card-date">
          <Calendar size={14} />
          {article.published}
        </span>
        <button 
          className="btn-read-more"
          onClick={() => onViewDetail(article.id)}
          title="View full article details"
        >
          Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
