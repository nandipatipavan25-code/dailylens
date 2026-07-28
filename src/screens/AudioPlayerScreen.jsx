import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';
import useStore from '../store/useStore';
import { getArticleById } from '../data/apiService';
import styles from './AudioPlayerScreen.module.css';

const AudioPlayerScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voices, setVoices] = useState([]);
  
  const { 
    activeAudioArticle, 
    playArticle, 
    isPlaying, 
    pauseAudio, 
    resumeAudio,
    audioProgress,
    setAudioProgress,
    playbackSpeed,
    setPlaybackSpeed,
    preferredVoiceURI,
    setPreferredVoiceURI
  } = useStore();

  useEffect(() => {
    // If navigating directly or refreshing, ensure we load and set the active article
    if (!activeAudioArticle || activeAudioArticle.id !== id) {
      getArticleById(id).then(data => {
        if (data) playArticle(data);
      });
    }
  }, [id, activeAudioArticle, playArticle]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      
      // Filter for English and Indian language voices (en-IN, hi-IN, ta-IN, te-IN, etc.)
      const relevantVoices = allVoices.filter(v => 
        v.lang.toLowerCase().startsWith('en') || 
        v.lang.toLowerCase().includes('-in') || 
        v.name.toLowerCase().includes('india') ||
        v.lang.toLowerCase().startsWith('hi')
      );
      
      // Sort: Prioritize cloud/natural/Google/online voices first so they are at the top of the select dropdown
      const sortedVoices = [...relevantVoices].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        // Prioritize Indian voices (e.g. Heera, Neeraja, Ravi, Google India English, Hindi voices)
        const aIsIndian = a.lang.toLowerCase().includes('-in') || aName.includes('india');
        const bIsIndian = b.lang.toLowerCase().includes('-in') || bName.includes('india');
        
        if (aIsIndian && !bIsIndian) return -1;
        if (!aIsIndian && bIsIndian) return 1;
        
        const aIsNatural = aName.includes('google') || aName.includes('online') || aName.includes('natural') || aName.includes('neural') || !a.localService;
        const bIsNatural = bName.includes('google') || bName.includes('online') || bName.includes('natural') || bName.includes('neural') || !b.localService;
        
        if (aIsNatural && !bIsNatural) return -1;
        if (!aIsNatural && bIsNatural) return 1;
        return 0;
      });

      setVoices(sortedVoices.length > 0 ? sortedVoices : allVoices);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!activeAudioArticle) return null;

  const handleTogglePlay = () => {
    isPlaying ? pauseAudio() : resumeAudio();
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setAudioProgress(Math.max(0, Math.min(100, percentage)));
  };

  // Calculate precise speaking duration dynamically based on actual word count and playback speed
  const speakText = `${activeAudioArticle.headline}. ${activeAudioArticle.summary || ''}. ${activeAudioArticle.content || ''}`;
  const wordCount = speakText.split(/\s+/).filter(Boolean).length;
  // Average speaking rate is 150 words per minute (2.5 words per second)
  const totalSeconds = Math.max(5, Math.round(wordCount / (2.5 * playbackSpeed)));
  const currentSeconds = Math.min(totalSeconds, Math.floor((audioProgress / 100) * totalSeconds));
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`screen-container no-nav ${styles.playerScreen}`}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.iconBtn}>
          <ChevronDown size={32} />
        </button>
        <div className={styles.headerText}>
          <span className={styles.nowPlaying}>Now Playing from</span>
          <span className={styles.sourceName}>{activeAudioArticle.source.name}</span>
        </div>
        <div className={styles.voiceSelector}>
          <Settings size={22} className={styles.settingsIcon} />
          <select
            value={preferredVoiceURI}
            onChange={(e) => setPreferredVoiceURI(e.target.value)}
            className={styles.voiceSelect}
            aria-label="Select Speech Voice"
          >
            <option value="">Default (IN)</option>
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name.replace(/Microsoft|Google|Natural/g, '').trim()} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.artworkContainer}>
        <div className={styles.artworkWrapper}>
          <img 
            src={activeAudioArticle.imageUrl} 
            alt="Artwork" 
            className={`${styles.artwork} ${isPlaying ? styles.playing : ''}`} 
          />
        </div>
      </div>

      <div className={styles.infoSection}>
        <h1 className={styles.headline}>{activeAudioArticle.headline}</h1>
        <p className={styles.author}>{activeAudioArticle.author}</p>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.progressBarWrapper} onClick={handleSeek}>
          <div className={styles.progressBarBg}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${audioProgress}%` }}
            >
              <div className={styles.progressHandle}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.timeInfo}>
          <span>{formatTime(currentSeconds)}</span>
          <span>{formatTime(totalSeconds)}</span>
        </div>

        <div className={styles.mainControls}>
          <button className={styles.speedBtn} onClick={cycleSpeed}>
            {playbackSpeed}x
          </button>
          
          <div className={styles.playbackGroup}>
            <button className={styles.skipBtn} onClick={() => setAudioProgress(Math.max(0, audioProgress - 10))}>
              <SkipBack size={32} fill="currentColor" />
            </button>
            
            <button className={styles.playBtn} onClick={handleTogglePlay}>
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" />}
            </button>
            
            <button className={styles.skipBtn} onClick={() => setAudioProgress(Math.min(100, audioProgress + 10))}>
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>
          
          {/* Empty div for flex spacing balance */}
          <div style={{ width: '48px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerScreen;
