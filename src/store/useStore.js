import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // User Onboarding & Preferences
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      interests: [],
      toggleInterest: (interest) => set((state) => {
        const hasInterest = state.interests.includes(interest);
        if (hasInterest) {
          return { interests: state.interests.filter(i => i !== interest) };
        }
        return { interests: [...state.interests, interest] };
      }),
      
      // Saved Articles
      savedArticles: [],
      saveArticle: (article) => set((state) => {
        if (!state.savedArticles.find(a => a.id === article.id)) {
          return { savedArticles: [{ ...article, savedAt: new Date().toISOString() }, ...state.savedArticles] };
        }
        return state;
      }),
      removeSavedArticle: (id) => set((state) => ({
        savedArticles: state.savedArticles.filter(a => a.id !== id)
      })),
      isSaved: (id) => get().savedArticles.some(a => a.id === id),

      // Audio Player
      activeAudioArticle: null,
      isPlaying: false,
      audioProgress: 0,
      playbackSpeed: 1,
      preferredVoiceURI: '',
      
      playArticle: (article) => set({ activeAudioArticle: article, isPlaying: true, audioProgress: 0 }),
      pauseAudio: () => set({ isPlaying: false }),
      resumeAudio: () => set({ isPlaying: true }),
      setAudioProgress: (progress) => set({ audioProgress: progress }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setPreferredVoiceURI: (voiceURI) => set({ preferredVoiceURI: voiceURI }),
      closeAudioPlayer: () => set({ activeAudioArticle: null, isPlaying: false, audioProgress: 0 }),
      
      // User Stats
      stats: {
        articlesRead: 0,
        hoursListened: 0,
        readingStreak: 1
      },
      incrementArticlesRead: () => set((state) => ({
        stats: { ...state.stats, articlesRead: state.stats.articlesRead + 1 }
      })),
      addListeningTime: (minutes) => set((state) => ({
        stats: { ...state.stats, hoursListened: state.stats.hoursListened + (minutes / 60) }
      })),

      // Cache for fetched articles (so we don't call the API repeatedly)
      feedArticles: [],
      addFeedArticles: (articles) => set((state) => {
        const existingIds = new Set(state.feedArticles.map(a => a.id));
        const newArticles = articles.filter(a => !existingIds.has(a.id));
        return { feedArticles: [...state.feedArticles, ...newArticles] };
      })
    }),
    {
      name: 'dailylens-storage',
      partialize: (state) => {
        const { feedArticles, ...persistedState } = state;
        return persistedState;
      }
    }
  )
);

export default useStore;
