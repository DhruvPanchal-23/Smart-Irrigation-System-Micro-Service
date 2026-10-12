import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCloudRain, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import useAuth from '../hooks/useAuth.js';
import Alert from '../components/common/Alert.jsx';

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const change = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await auth.login(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-story" aria-hidden="true">
        <div className="login-orbit login-orbit-one" />
        <div className="login-orbit login-orbit-two" />
        <div className="login-orbit login-orbit-three" />
        <div className="login-story-content">
          <span className="login-story-mark"><FiCloudRain /></span>
          <p className="login-story-kicker">Weather-aware farming</p>
          <h1>Welcome back<br />to KisanSetu.</h1>
          <p className="login-story-copy">
            Turn changing weather into clearer irrigation decisions for every field you manage.
          </p>
          <div className="login-story-stat">
            <strong>Plan with confidence</strong>
            <span>Farm weather, recommendations, and history in one place.</span>
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-heading">
            <span className="eyebrow">Farmer portal</span>
            <h2>Welcome back</h2>
            <p>New to KisanSetu? <Link to="/register">Create your account</Link></p>
          </div>

          <form className="login-form" onSubmit={submit}>
            <Alert>{error}</Alert>

            <label className="login-field">
              <span>Email address</span>
              <span className="login-input-wrap">
                <FiMail aria-hidden="true" />
                <input name="email" type="email" value={form.email} onChange={change} autoComplete="email" placeholder="farmer@example.com" required />
              </span>
            </label>

            <label className="login-field">
              <span>Password</span>
              <span className="login-input-wrap">
                <FiLock aria-hidden="true" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={change} autoComplete="current-password" placeholder="Enter your password" required />
                <button className="login-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            <button className="login-submit" disabled={busy} type="submit">
              <span>{busy ? 'Signing in...' : 'Sign in to dashboard'}</span>
              {!busy && <FiArrowRight aria-hidden="true" />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
