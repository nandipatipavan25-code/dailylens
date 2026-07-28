import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import useStore from '../store/useStore';
import { getFeedArticles } from '../data/apiService';
import NewsCard from '../components/NewsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import styles from './FeedScreen.module.css';

const FeedScreen = () => {
  const navigate = useNavigate();
  const { playArticle } = useStore();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    getFeedArticles().then(data => {
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const handleOpenArticle = (article) => {
    navigate(`/article/${article.id}`);
  };

  const handlePlayAudio = (article) => {
    // Unlock speech synthesis inside the click event handler
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch (e) {}

    playArticle(article);
    navigate(`/audio-player/${article.id}`);
  };

  return (
    <div className={`screen-container ${styles.feedScreen}`}>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.logo}>
            <div className={styles.lens}></div>
            <h2>DailyLens AI</h2>
          </div>
          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={() => navigate('/saved')} aria-label="Saved Articles">
              <Bookmark size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.feed}>
        {loading ? (
          <>
            <SkeletonLoader type="card" />
            <SkeletonLoader type="card" />
            <SkeletonLoader type="card" />
          </>
        ) : (
          articles.map(article => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onClick={handleOpenArticle}
              onPlay={handlePlayAudio}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default FeedScreen;
