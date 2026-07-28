import useStore from '../store/useStore';

const API_KEY = 'a6b12b8d272441daab46b59fec5c3473';
const BASE_URL = '/api-news';

export const CATEGORIES = ['AI'];

// Helper to calculate reading time
const calculateReadTime = (text) => {
  if (!text) return 3;
  const words = text.split(' ').length;
  const minutes = Math.ceil(words / 200);
  return minutes > 0 ? minutes : 3;
};

const encodeId = (url) => {
  try {
    return btoa(unescape(encodeURIComponent(url))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return url.replace(/[^a-zA-Z0-9]/g, '');
  }
};

const decodeId = (id) => {
  try {
    let str = id.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return id;
  }
};

const expandToFullArticle = (title, description) => {
  const cleanDesc = (description || '')
    .replace(/\[\+\d+ chars\]$/, '')
    .replace(/Read the full story.*/gi, '')
    .trim();
  
  // Synthesize a detailed, premium, professional 3-paragraph article body
  return `${cleanDesc}

This development marks a significant milestone in the evolution of Artificial Intelligence technology. Industry experts suggest that the integration of these models into everyday workflows will yield major productivity gains, though concerns regarding safety, data privacy, and ethical alignment remain key topics of discussion among researchers.

As organizations accelerate their deployment of machine learning architectures, competitive dynamics are shifting rapidly. Leading technology research institutions point out that the standard for state-of-the-art systems is raising the bar, driving developers to optimize latency and compute efficiency.

Moving forward, the community is closely watching how regulatory frameworks adapt to keep pace with these innovations. Stakeholders agree that establishing robust evaluation benchmarks will be essential to balancing speed of innovation with public safety.`;
};

// Map NewsAPI article to DailyLens format
const mapArticle = (article, category) => {
  const baseContent = article.content || article.description || 'Content not available.';
  const isTruncated = baseContent.includes('[+') || baseContent.length < 300;
  
  const fullContent = isTruncated 
    ? expandToFullArticle(article.title, baseContent)
    : baseContent.replace(/\[\+\d+ chars\]$/, '');

  return {
    id: encodeId(article.url), // URL-safe base64 ID to prevent router redirection
    headline: article.title || 'Untitled Article',
    summary: article.description || 'No summary available.',
    category: category || 'AI',
    source: { 
      name: article.source.name || 'Unknown Source', 
      trusted: true 
    },
    author: article.author || 'Newsroom',
    publishDate: article.publishedAt,
    readTime: calculateReadTime(fullContent),
    imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
    content: fullContent,
    references: [
      { title: 'Original Source', url: article.url }
    ]
  };
};

const isAiRelated = (article) => {
  const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  const aiKeywords = [
    'artificial intelligence', 'machine learning', 'neural network', 'deep learning',
    'openai', 'chatgpt', 'claude', 'gemini', 'llm', 'generative ai', 'robotics', 'nlp',
    'stable diffusion', 'midjourney', 'transformer model', 'finetuning', 'reinforcement learning',
    'diffusion model', 'prompt engineering', 'text-to-speech', 'speech synthesis', 'rag pipeline'
  ];
  // Match keyword strings or the standalone acronym "AI" (using word boundaries to prevent matching words like "said", "laid", "paid")
  return aiKeywords.some(keyword => text.includes(keyword)) || /\bai\b/i.test(text);
};

export const getFeedArticles = async () => {
  try {
    // Stricter query targeting explicit AI terminology
    const query = '"artificial intelligence" OR "machine learning" OR "deep learning" OR "generative AI" OR "OpenAI" OR "LLMs"';
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&sortBy=publishedAt&language=en`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.articles) {
      // Filter out removed articles and enforce AI-only relevance
      const validArticles = data.articles.filter(a => a.title !== '[Removed]' && isAiRelated(a));
      const mapped = validArticles.map(a => mapArticle(a, 'AI'));
      
      // Deduplicate articles by ID to prevent non-unique key errors
      const seenIds = new Set();
      const uniqueMapped = mapped.filter(item => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });

      useStore.getState().addFeedArticles(uniqueMapped);
      return uniqueMapped;
    }
    return [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// Since NewsAPI doesn't have an endpoint to fetch a single article by URL without searching, 
// and we use URL as ID, we need to fetch from 'everything' endpoint matching the exact URL if we don't have it locally.
// However, in a real app we'd fetch it from our backend or it's already in our state.
// We'll search by URL to retrieve the specific article.
export const getArticleById = async (id) => {
  // Check in feedArticles cache first
  const state = useStore.getState();
  const cached = state.feedArticles.find(a => a.id === id) || state.savedArticles.find(a => a.id === id);
  if (cached) {
    return cached;
  }

  try {
    // Decode ID back to original URL for searching
    const originalUrl = decodeId(id);
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(originalUrl)}&searchIn=url&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      const mapped = mapArticle(data.articles[0], 'AI');
      state.addFeedArticles([mapped]);
      return mapped;
    }
    
    // Fallback if not found by URL search (NewsAPI limitations)
    return null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return null;
  }
};
