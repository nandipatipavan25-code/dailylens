import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useStore from './store/useStore';

// Components
import SpeechManager from './components/SpeechManager';

// Screens
import SplashScreen from './screens/SplashScreen';
import Onboarding from './screens/Onboarding';
import FeedScreen from './screens/FeedScreen';
import ArticleScreen from './screens/ArticleScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import SavedScreen from './screens/SavedScreen';

const Layout = ({ children }) => {
  return (
    <>
      <SpeechManager />
      {children}
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const hasCompletedOnboarding = useStore(state => state.hasCompletedOnboarding);
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/feed" element={<ProtectedRoute><FeedScreen /></ProtectedRoute>} />
          <Route path="/article/:id" element={<ProtectedRoute><ArticleScreen /></ProtectedRoute>} />
          <Route path="/audio-player/:id" element={<ProtectedRoute><AudioPlayerScreen /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
