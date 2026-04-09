import { useEffect, useState, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { EditorPage }         from './pages/EditorPage';
import { HomePage }           from './pages/HomePage';
import { SignInPage }         from './pages/SignInPage';
import { SignUpPage }         from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SplashScreen }       from './components/ui/SplashScreen';

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, color: '#e05c5c', fontFamily: 'monospace', background: '#0f0f0f', minHeight: '100vh' }}>
        <h2>Something crashed</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error.message}\n{this.state.error.stack}</pre>
        <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: '8px 16px', cursor: 'pointer' }}>Try again</button>
      </div>
    );
    return this.props.children;
  }
}

function PrivateRoute({ children }) {
  return localStorage.getItem('etherx_token') ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  useTheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.title = 'EtherxWord';
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen title="EtherxWord" logoSrc="/assets/etherxword-logo.png" />;
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/"                element={<Navigate to="/signin" replace />} />
          <Route path="/signin"          element={<SignInPage />} />
          <Route path="/signup"          element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home"            element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/doc/new"         element={<PrivateRoute><ErrorBoundary><EditorPage /></ErrorBoundary></PrivateRoute>} />
          <Route path="/doc/:id"         element={<PrivateRoute><ErrorBoundary><EditorPage /></ErrorBoundary></PrivateRoute>} />
          <Route path="*"                element={<Navigate to="/signin" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
