import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/services/api';

export function SignUpPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep]     = useState('form'); // 'form' | 'otp'
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp]       = useState('');
  const [focused, setFocused] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await authApi.signup({ name: form.name, email: form.email, password: form.password });
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authApi.verifyOtp({ email: form.email, otp });
      localStorage.setItem('etherx_token', token);
      localStorage.setItem('etherx_user', JSON.stringify(user));
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await authApi.resendOtp({ email: form.email, type: 'verify' });
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const fields = [
    { key: 'name',     label: 'Full Name',       type: 'text',     placeholder: 'Your name' },
    { key: 'email',    label: 'Email',            type: 'email',    placeholder: 'you@example.com' },
    { key: 'password', label: 'Password',         type: 'password', placeholder: '••••••••' },
    { key: 'confirm',  label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="auth-bg">
      <button className="auth-theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀' : '🌙'}
      </button>
      <div className="auth-card anim-scale-in">
        <div className="auth-logo-wrap">
          <img src="/assets/etherxword-logo.png" alt="EtherxWord" className="auth-logo" />
        </div>

        {step === 'form' ? (
          <>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Join EtherxWord today</p>
            <form onSubmit={handleSignup} className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              {fields.map(({ key, label, type, placeholder }) => (
                <div className="auth-field" key={key}>
                  <label className="auth-label">{label}</label>
                  <input
                    type={type} required placeholder={placeholder}
                    value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={`auth-input${focused === key ? ' focused' : ''}`}
                    onFocus={() => setFocused(key)} onBlur={() => setFocused('')}
                  />
                </div>
              ))}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Creating…' : 'Create Account'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="auth-title">Verify your email</h1>
            <p className="auth-sub">We sent a 6-digit code to <strong>{form.email}</strong></p>
            <form onSubmit={handleVerify} className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              {resent && <div className="auth-success">OTP resent!</div>}
              <div className="auth-field">
                <label className="auth-label">OTP Code</label>
                <input
                  type="text" required placeholder="123456" maxLength={6}
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`auth-input${focused === 'otp' ? ' focused' : ''}`}
                  onFocus={() => setFocused('otp')} onBlur={() => setFocused('')}
                  style={{ letterSpacing: 8, fontSize: 20, textAlign: 'center' }}
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
            </form>
            <p className="auth-footer">
              Didn't receive it?{' '}
              <button onClick={handleResend} className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Resend OTP
              </button>
            </p>
          </>
        )}

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/signin" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
