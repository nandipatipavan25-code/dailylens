import { useNavigate } from 'react-router-dom';
import { BookmarkMinus, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import NewsCard from '../components/NewsCard';
import styles from './SavedScreen.module.css';

const SavedScreen = () => {
  const navigate = useNavigate();
  const { savedArticles, playArticle } = useStore();

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
    <div className={`screen-container no-nav ${styles.savedScreen}`}>
      <header className={styles.header}>
        <button onClick={() => navigate('/feed')} className={styles.backBtn} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Saved Articles</h1>
      </header>

      <main className={styles.content}>
        {savedArticles.length === 0 ? (
          <div className={`${styles.emptyState} animate-fade-in`}>
            <div className={styles.emptyIcon}>
              <BookmarkMinus size={48} />
            </div>
            <h2>No saved articles yet</h2>
            <p>Articles you save will appear here for easy access later.</p>
            <button className={styles.exploreBtn} onClick={() => navigate('/feed')}>
              Explore News
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            {savedArticles.map(article => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onClick={handleOpenArticle}
                onPlay={handlePlayAudio}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedScreen;
