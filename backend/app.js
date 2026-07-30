/**
 * News Aggregator Backend API
 * Built with Express.js and Node.js
 * 
 * Features:
 * - CORS middleware enabled for cross-origin React access
 * - REST API endpoints: GET /news, GET /news/:id, POST /news
 * - In-memory JSON array data storage
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for React frontend
app.use(cors());

// Express middleware to parse incoming JSON payloads
app.use(express.json());

// In-Memory Sample News Articles Array
let newsArticles = [
  {
    id: 1,
    title: "AI is changing the world",
    category: "Technology",
    source: "BBC",
    published: "2026-07-30",
    summary: "Artificial Intelligence technologies are rapidly transforming industry workflows, automation, and daily productivity worldwide.",
    url: "https://bbc.com/news/technology-ai-impact"
  },
  {
    id: 2,
    title: "Quantum Computing Breakthrough Unveiled",
    category: "Technology",
    source: "TechCrunch",
    published: "2026-07-29",
    summary: "Researchers achieve fault-tolerant quantum error correction, paving the way for commercially viable quantum supercomputers.",
    url: "https://techcrunch.com/quantum-breakthrough"
  },
  {
    id: 3,
    title: "Global Renewable Energy Generation Hits Record High",
    category: "Science",
    source: "Reuters",
    published: "2026-07-28",
    summary: "Solar and wind energy surpassed traditional power sources in total electrical grid supply across major economies this quarter.",
    url: "https://reuters.com/renewable-energy-record"
  },
  {
    id: 4,
    title: "Stock Markets Surge Following Tech Earnings Boom",
    category: "Business",
    source: "Bloomberg",
    published: "2026-07-27",
    summary: "Major indices closed at historic highs today as semiconductor and cloud computing companies reported record quarterly revenues.",
    url: "https://bloomberg.com/markets-tech-surge"
  },
  {
    id: 5,
    title: "James Webb Telescope Discovers Atmospheres on Exoplanets",
    category: "Science",
    source: "NASA Space Flight",
    published: "2026-07-26",
    summary: "Spectroscopic analysis detects water vapor and carbon dioxide in the habitable zone atmosphere of TRAPPIST-1 system planet.",
    url: "https://nasaspaceflight.com/webb-exoplanet-atmosphere"
  },
  {
    id: 6,
    title: "Breakthrough Cancer Therapy Enters Phase III Clinical Trials",
    category: "Health",
    source: "CNN Health",
    published: "2026-07-25",
    summary: "Targeted mRNA immunotherapy shows unprecedented complete remission rates in late-stage solid tumor clinical studies.",
    url: "https://cnn.com/health/mrna-cancer-therapy"
  },
  {
    id: 7,
    title: "Next-Gen Electric Vehicle Battery Achieves 1000km Range",
    category: "Technology",
    source: "Wired",
    published: "2026-07-24",
    summary: "Solid-state battery cells demonstrate ultra-fast 10-minute charging capabilities alongside high energy density.",
    url: "https://wired.com/ev-solid-state-battery"
  },
  {
    id: 8,
    title: "World Cup Finals Set Attendance and Viewership Records",
    category: "Sports",
    source: "ESPN",
    published: "2026-07-23",
    summary: "Millions of fans worldwide tuned in as the dramatic tournament concluded with an astonishing extra-time winning goal.",
    url: "https://espn.com/worldcup-finals-record"
  }
];

// Helper counter to assign incremental IDs to new articles
let nextId = newsArticles.length + 1;

/**
 * Root endpoint - API Health Check
 */
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the News Aggregator REST API",
    status: "Healthy",
    endpoints: {
      getAllNews: "GET /news",
      getNewsById: "GET /news/:id",
      addNews: "POST /news"
    }
  });
});

/**
 * REST API 1: GET /news
 * Returns all news articles.
 * Supports optional category filtering via query param: /news?category=Technology
 * Supports optional search query param: /news?search=AI
 */
app.get('/news', (req, res) => {
  try {
    let result = [...newsArticles];
    const { category, search } = req.query;

    if (category && category !== 'All') {
      result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        (item.summary && item.summary.toLowerCase().includes(query))
      );
    }

    // Sort news by published date descending (latest first)
    result.sort((a, b) => new Date(b.published) - new Date(a.published));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve news articles", details: error.message });
  }
});

/**
 * REST API 2: GET /news/:id
 * Returns a single news article by its unique ID.
 */
app.get('/news/:id', (req, res) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    if (isNaN(articleId)) {
      return res.status(400).json({ error: "Invalid article ID format. Must be an integer." });
    }

    const article = newsArticles.find(item => item.id === articleId);

    if (!article) {
      return res.status(404).json({ error: `News article with ID ${articleId} not found.` });
    }

    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve news article", details: error.message });
  }
});

/**
 * REST API 3: POST /news
 * Adds a new news article to the JSON collection.
 * Required JSON payload: { title, category, source, published, summary (optional) }
 */
app.post('/news', (req, res) => {
  try {
    const { title, category, source, published, summary, url } = req.body;

    // Validation
    if (!title || !category || !source || !published) {
      return res.status(400).json({
        error: "Missing required fields.",
        requiredFields: ["title", "category", "source", "published"]
      });
    }

    const newArticle = {
      id: nextId++,
      title: title.trim(),
      category: category.trim(),
      source: source.trim(),
      published: published.trim(),
      summary: summary ? summary.trim() : "No summary provided for this article.",
      url: url ? url.trim() : ""
    };

    newsArticles.unshift(newArticle); // Add to beginning of list

    return res.status(201).json({
      message: "News article created successfully!",
      article: newArticle
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create news article", details: error.message });
  }
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 News Aggregator Backend Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📰 API Endpoints:`);
  console.log(`   - GET  /news       (Fetch all news)`);
  console.log(`   - GET  /news/:id   (Fetch single article)`);
  console.log(`   - POST /news       (Add new article)`);
  console.log(`=================================================`);
});
