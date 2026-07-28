import styles from './SkeletonLoader.module.css';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className={styles.cardSkeleton}>
        <div className={`${styles.shimmer} ${styles.imageBox}`}></div>
        <div className={styles.contentBox}>
          <div className={`${styles.shimmer} ${styles.line} ${styles.meta}`}></div>
          <div className={`${styles.shimmer} ${styles.line} ${styles.title}`}></div>
          <div className={`${styles.shimmer} ${styles.line} ${styles.titleShort}`}></div>
          <div className={`${styles.shimmer} ${styles.line} ${styles.summary}`}></div>
          <div className={`${styles.shimmer} ${styles.line} ${styles.summary}`}></div>
        </div>
      </div>
    );
  }

  return <div className={`${styles.shimmer} ${styles.default}`}></div>;
};

export default SkeletonLoader;
