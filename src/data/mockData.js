export const mockArticles = [
  {
    id: '1',
    headline: 'OpenAI announces GPT-5 with multimodality focus',
    summary: 'The new model features advanced reasoning capabilities and native audio generation, pushing the boundaries of AI.',
    category: 'AI',
    source: { name: 'TechCrunch', trusted: true },
    author: 'Sarah Perez',
    publishDate: '2026-06-10T10:00:00Z',
    readTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    content: `
      OpenAI has officially announced GPT-5, the next generation of its flagship large language model. This release focuses heavily on native multimodality, allowing the model to seamlessly process and generate text, audio, and visual content without relying on separate sub-models.

      According to the announcement, the model exhibits significant improvements in advanced reasoning and logical deduction. "We've rebuilt the architecture from the ground up to support deeper context understanding," said the CEO during the keynote.

      The audio generation capabilities are particularly noteworthy, offering real-time, highly expressive voice synthesis that adapts to context and emotion natively.
    `,
    references: [
      { title: 'Official OpenAI Blog', url: 'https://openai.com/blog' },
      { title: 'Reuters Report', url: 'https://reuters.com' }
    ]
  },
  {
    id: '2',
    headline: 'Global markets surge following interest rate cuts',
    summary: 'Major indices reached new all-time highs as central banks signal an end to quantitative tightening.',
    category: 'Finance',
    source: { name: 'Bloomberg', trusted: true },
    author: 'John Authers',
    publishDate: '2026-06-10T08:30:00Z',
    readTime: 4,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    content: `
      Stock markets globally experienced a massive rally today following synchronized interest rate cuts by major central banks. The S&P 500 and Nasdaq both closed at record highs, driven by strong performances in the technology and consumer discretionary sectors.

      Analysts suggest that the coordinated dovish shift indicates a definitive end to the quantitative tightening era that has dominated the past few years. "Investors are pricing in a soft landing and sustained growth," noted one senior strategist.
    `,
    references: [
      { title: 'Bloomberg Market Data', url: 'https://bloomberg.com' },
      { title: 'Federal Reserve Press Release', url: 'https://federalreserve.gov' }
    ]
  },
  {
    id: '3',
    headline: 'Apple unveils redesigned MacBook Pro with M5 chip',
    summary: 'The latest laptop features a thinner chassis, edge-to-edge display, and unprecedented battery life.',
    category: 'Technology',
    source: { name: 'The Verge', trusted: true },
    author: 'Nilay Patel',
    publishDate: '2026-06-09T15:00:00Z',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    content: `
      Apple has taken the wraps off its highly anticipated MacBook Pro update. The new machines are powered by the M5 chip, built on a new 2nm process that promises 40% better performance and up to 30 hours of battery life.

      The design has also seen a major overhaul. The chassis is 15% thinner, and the display now stretches almost entirely to the edge, virtually eliminating bezels. The controversial notch has been replaced by a dynamic "pill" cutout that houses the upgraded 4K webcam and FaceID sensors.
    `,
    references: [
      { title: 'Apple Newsroom', url: 'https://apple.com/newsroom' }
    ]
  },
  {
    id: '4',
    headline: 'New breakthrough in solid-state battery technology',
    summary: 'Researchers have developed a stable solid-state battery that charges in 5 minutes and lasts over 1000 miles.',
    category: 'Science',
    source: { name: 'Nature', trusted: true },
    author: 'Dr. Emily Chen',
    publishDate: '2026-06-08T12:00:00Z',
    readTime: 7,
    imageUrl: 'https://images.unsplash.com/photo-1617325247661-675ab034e320?auto=format&fit=crop&q=80&w=800',
    content: `
      In a paper published in Nature today, a team of international researchers unveiled a new solid-state battery architecture that overcomes the long-standing issues of dendrite formation and degradation.

      Using a novel ceramic-polymer composite electrolyte, the battery achieved a full charge from 0 to 100% in just under 5 minutes. Furthermore, energy density improvements mean that electric vehicles equipped with this technology could achieve ranges exceeding 1000 miles on a single charge.
    `,
    references: [
      { title: 'Nature Journal Publication', url: 'https://nature.com' },
      { title: 'MIT Technology Review', url: 'https://technologyreview.com' }
    ]
  }
];

export const CATEGORIES = [
  'All', 'Technology', 'AI', 'Business', 'Finance', 'Startups', 'Design', 'Sports', 'Health', 'Science', 'World News'
];

// Simulated API calls
export const getFeedArticles = async (category = 'All', delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category === 'All') resolve(mockArticles);
      else resolve(mockArticles.filter(a => a.category === category));
    }, delay);
  });
};

export const getArticleById = async (id, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockArticles.find(a => a.id === id));
    }, delay);
  });
};

export const searchArticles = async (query, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(mockArticles.filter(a => 
        a.headline.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) ||
        a.source.name.toLowerCase().includes(q)
      ));
    }, delay);
  });
};
