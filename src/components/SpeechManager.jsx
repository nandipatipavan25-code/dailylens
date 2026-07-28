import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const SpeechManager = () => {
  const { 
    activeAudioArticle, 
    isPlaying, 
    playbackSpeed, 
    preferredVoiceURI,
    setAudioProgress, 
    pauseAudio,
    addListeningTime
  } = useStore();

  const progressInterval = useRef(null);

  useEffect(() => {
    if (!activeAudioArticle) {
      window.speechSynthesis.cancel();
      return;
    }

    // Ensure we only read clean story text (removing markdown, bracketed URLs, HTML tags, and trailing metadata)
    const cleanSpokenText = (text) => {
      if (!text) return '';
      return text
        .replace(/https?:\/\/\S+/gi, '') // Strip links
        .replace(/\[\+\d+\s+chars\]/gi, '') // Strip truncation flags
        .replace(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/gi, '') // Strip emails
        .replace(/Read the full story.*/gi, '') // Strip boilerplate source links
        .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
        .trim();
    };

    const cleanHeadline = cleanSpokenText(activeAudioArticle.headline);
    const cleanSummary = cleanSpokenText(activeAudioArticle.summary);
    const cleanBodyContent = cleanSpokenText(activeAudioArticle.content);

    // Form the final speaking script (excluding metadata like author, publication date, etc.)
    const speakText = `${cleanHeadline}. ${cleanSummary}. ${cleanBodyContent}`;

    let speakTimeout = null;

    if (isPlaying) {
      // Clear queue
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.rate = playbackSpeed;
      
      // Keep reference to prevent GC in Chrome/Safari
      window.currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (preferredVoiceURI) {
        selectedVoice = voices.find(v => v.voiceURI === preferredVoiceURI);
      }
      
      if (!selectedVoice) {
        // Select Indian English voices
        const indianVoices = voices.filter(v => 
          v.lang === 'en-IN' || 
          v.lang.toLowerCase().includes('en-in') || 
          v.name.toLowerCase().includes('india')
        );
        
        // Prioritize Google, Neural, Online, or Natural voices which sound human-like and premium
        selectedVoice = indianVoices.find(v => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('online')) ||
                        indianVoices.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural')) ||
                        indianVoices.find(v => !v.localService) || // Cloud voices usually sound better
                        indianVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`DailyLens Voice: Selected ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        // If no Indian voice is found, fall back to any high-quality natural English voice
        const naturalEnglish = voices.find(v => v.lang.toLowerCase().startsWith('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('natural')));
        if (naturalEnglish) {
          utterance.voice = naturalEnglish;
          console.log(`DailyLens Voice Fallback: Selected natural voice ${naturalEnglish.name}`);
        } else {
          console.warn('DailyLens Voice: No natural Indian or English voice found, using system default.');
        }
      }

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const progress = (event.charIndex / speakText.length) * 100;
          setAudioProgress(progress);
        }
      };

      utterance.onend = () => {
        pauseAudio();
        setAudioProgress(100);
        window.currentUtterance = null;
      };

      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        if (e.error !== 'interrupted') {
          pauseAudio();
        }
      };

      // Trigger speech after a short delay to allow previous cancels to resolve cleanly
      speakTimeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);

      // Also track listening time while playing
      progressInterval.current = setInterval(() => {
        // Add 1 second of listening time
        addListeningTime(1 / 60);
      }, 1000);
    } else {
      window.speechSynthesis.cancel();
      window.currentUtterance = null;
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (speakTimeout) clearTimeout(speakTimeout);
      window.speechSynthesis.cancel();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [activeAudioArticle, isPlaying, playbackSpeed, preferredVoiceURI, setAudioProgress, pauseAudio, addListeningTime]);

  return null;
};

export default SpeechManager;
