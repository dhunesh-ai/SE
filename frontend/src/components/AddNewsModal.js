import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

/**
 * AddNewsModal Component
 * Form modal to publish a new news article to the backend API.
 */
const AddNewsModal = ({ isOpen, onClose, onAddNews }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    source: '',
    published: new Date().toISOString().split('T')[0],
    summary: '',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.source.trim()) {
      setFormError('Please fill out all required fields (Title & Source).');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      await onAddNews(formData);
      // Reset form state and close modal on success
      setFormData({
        title: '',
        category: 'Technology',
        source: '',
        published: new Date().toISOString().split('T')[0],
        summary: '',
        url: ''
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to publish article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={22} color="#38bdf8" />
            <h2 className="modal-title">Publish News Article</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {formError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Next-Gen Space Telescope Launches"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Source / Publisher *</label>
              <input
                type="text"
                name="source"
                className="form-input"
                placeholder="e.g. BBC, TechCrunch"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Published Date *</label>
              <input
                type="date"
                name="published"
                className="form-input"
                value={formData.published}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article URL (Optional)</label>
              <input
                type="url"
                name="url"
                className="form-input"
                placeholder="https://example.com/news"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Summary / Content Overview</label>
            <textarea
              name="summary"
              className="form-textarea"
              placeholder="Provide a brief summary of the news story..."
              value={formData.summary}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsModal;
