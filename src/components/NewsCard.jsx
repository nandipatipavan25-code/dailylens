import { Clock, Play, Bookmark } from 'lucide-react';
import useStore from '../store/useStore';
import styles from './NewsCard.module.css';

const NewsCard = ({ article, onClick, onPlay }) => {
  const { isSaved, saveArticle, removeSavedArticle } = useStore();
  const saved = isSaved(article.id);

  const handleSave = (e) => {
    e.stopPropagation();
    if (saved) {
      removeSavedArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay(article);
  };

  return (
    <article className={styles.card} onClick={() => onClick(article)}>
      <div className={styles.imageWrapper}>
        <img src={article.imageUrl} alt={article.headline} loading="lazy" />
        <div className={styles.categoryBadge}>{article.category}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.source}>
            {article.source.trusted && <span className={styles.trustedDot}></span>}
            {article.source.name}
          </span>
          <span className={styles.time}>
            <Clock size={12} /> {article.readTime} min read
          </span>
        </div>
        
        <h3 className={styles.headline}>{article.headline}</h3>
        <p className={styles.summary}>{article.summary}</p>
        
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleSave}>
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} color={saved ? "var(--color-primary)" : "var(--color-text-secondary)"} />
          </button>
          
          <button className={styles.playBtn} onClick={handlePlay}>
            <Play size={16} fill="currentColor" /> Listen
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
