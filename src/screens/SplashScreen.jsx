import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import styles from './SplashScreen.module.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const hasCompletedOnboarding = useStore(state => state.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate('/feed', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, hasCompletedOnboarding]);

  return (
    <div className={styles.splashScreen}>
      <div className={`${styles.content} animate-slide-up`}>
        <div className={styles.logo}>
          <div className={styles.lens}></div>
          <h1>DailyLens</h1>
        </div>
        <p className={styles.tagline}>Read Less. Know More.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
