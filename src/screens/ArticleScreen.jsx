import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark, ExternalLink } from 'lucide-react';
import useStore from '../store/useStore';
import { getArticleById } from '../data/apiService';
import SkeletonLoader from '../components/SkeletonLoader';
import styles from './ArticleScreen.module.css';

const ArticleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [mode, setMode] = useState('READ'); // 'READ' | 'LISTEN'
  
  const { 
    isSaved, 
    saveArticle, 
    removeSavedArticle, 
    incrementArticlesRead,
    playArticle,
    isPlaying,
    activeAudioArticle
  } = useStore();

  useEffect(() => {
    let isMounted = true;
    getArticleById(id).then(data => {
      if (isMounted) {
        setArticle(data);
        if (data) incrementArticlesRead();
      }
    });
    return () => { isMounted = false; };
  }, [id, incrementArticlesRead]);

  if (!article) {
    return (
      <div className={`screen-container no-nav ${styles.articleScreen}`}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}><ChevronLeft size={24} /></button>
        </div>
        <div className="container-px">
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  const saved = isSaved(article.id);
  const isCurrentlyPlayingThis = activeAudioArticle?.id === article.id && isPlaying;

  const handleSave = () => {
    saved ? removeSavedArticle(article.id) : saveArticle(article);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'LISTEN') {
      // Unlock speech synthesis inside the click event handler
      try {
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        window.speechSynthesis.speak(u);
      } catch (e) {}

      playArticle(article);
      navigate(`/audio-player/${article.id}`);
    }
  };

  return (
    <div className={`screen-container no-nav ${styles.articleScreen}`}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ChevronLeft size={24} />
        </button>
        <div className={styles.toggleWrapper}>
          <button 
            className={`${styles.toggleBtn} ${mode === 'READ' ? styles.active : ''}`}
            onClick={() => toggleMode('READ')}
          >
            READ
          </button>
          <button 
            className={`${styles.toggleBtn} ${mode === 'LISTEN' ? styles.active : ''}`}
            onClick={() => toggleMode('LISTEN')}
          >
            LISTEN {isCurrentlyPlayingThis && <span className={styles.playingIndicator}></span>}
          </button>
        </div>
        <button onClick={handleSave} className={styles.saveBtn}>
          <Bookmark size={24} fill={saved ? "currentColor" : "none"} color={saved ? "var(--color-primary)" : "var(--color-text-primary)"} />
        </button>
      </div>

      <div className={`${styles.hero} animate-fade-in`}>
        <img src={article.imageUrl} alt={article.headline} />
        <div className={styles.heroOverlay}>
          <div className={styles.categoryBadge}>{article.category}</div>
        </div>
      </div>

      <div className={`${styles.content} animate-slide-up`}>
        <h1 className={styles.headline}>{article.headline}</h1>
        
        <div className={styles.metaInfo}>
          <div className={styles.authorSource}>
            <span className={styles.source}>
              {article.source.trusted && <span className={styles.trustedDot}></span>}
              {article.source.name}
            </span>
            <span className={styles.author}>by {article.author}</span>
          </div>
          <div className={styles.dateRead}>
            <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>

        <div className={styles.bodyText}>
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </div>

        <div className={styles.references}>
          <h3>Sources & References</h3>
          <div className={styles.refList}>
            {article.references.map((ref, i) => (
              <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className={styles.refItem}>
                <div className={styles.refLink}>
                  <ExternalLink size={16} />
                  <span>{ref.title}</span>
                </div>
                <div className={styles.trustedDot}></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleScreen;
