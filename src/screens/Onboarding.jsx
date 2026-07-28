import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import styles from './Onboarding.module.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      navigate('/feed', { replace: true });
    }
  };

  return (
    <div className={`screen-container no-nav ${styles.onboarding}`}>
      <div className={styles.progress}>
        <div className={`${styles.bar} ${step >= 1 ? styles.active : ''}`}></div>
        <div className={`${styles.bar} ${step >= 2 ? styles.active : ''}`}></div>
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className={styles.title}>Your AI News.<br/>Your Way.</h1>
            <p className={styles.description}>
              Stay ahead with curated Artificial Intelligence news and updates. Listen on the go.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className={styles.iconWrapper}>
              {/* Simple illustrative element */}
              <div className={styles.audioWave}></div>
              <div className={styles.audioWave}></div>
              <div className={styles.audioWave}></div>
            </div>
            <h2 className={styles.title}>Listen instead of reading</h2>
            <p className={styles.description}>
              Convert every AI article into a voice briefing with premium text-to-speech synthesis.
            </p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.ctaButton} onClick={handleNext}>
          {step === 2 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
