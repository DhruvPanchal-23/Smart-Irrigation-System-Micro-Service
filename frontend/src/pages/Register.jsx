import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCloudRain, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import useAuth from '../hooks/useAuth.js';
import Alert from '../components/common/Alert.jsx';

export default function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
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
      await auth.register(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-story" aria-hidden="true">
        <div className="register-orbit register-orbit-one" />
        <div className="register-orbit register-orbit-two" />
        <div className="register-story-content">
          <span className="register-story-mark"><FiCloudRain /></span>
          <p className="register-story-kicker">Start smarter irrigation</p>
          <h1>Grow better<br />with KisanSetu.</h1>
          <p className="register-story-copy">
            Create your farmer account to organize farms, follow weather changes, and receive timely irrigation guidance.
          </p>
          <ul className="register-benefits">
            <li><span>01</span>Manage every farm in one place</li>
            <li><span>02</span>Track weather and advisory history</li>
            <li><span>03</span>Make more informed watering decisions</li>
          </ul>
        </div>
      </div>

      <div className="register-form-panel">
        <div className="register-form-wrap">
          <div className="register-heading">
            <span className="eyebrow">Farmer registration</span>
            <h2>Create your account</h2>
            <p>Already registered? <Link to="/login">Sign in instead</Link></p>
          </div>

          <form className="register-form" onSubmit={submit}>
            <Alert>{error}</Alert>

            <label className="register-field">
              <span>Full name</span>
              <span className="register-input-wrap">
                <FiUser aria-hidden="true" />
                <input name="name" value={form.name} onChange={change} autoComplete="name" placeholder="Enter your full name" minLength="2" required />
              </span>
            </label>

            <label className="register-field">
              <span>Email address</span>
              <span className="register-input-wrap">
                <FiMail aria-hidden="true" />
                <input name="email" type="email" value={form.email} onChange={change} autoComplete="email" placeholder="farmer@example.com" required />
              </span>
            </label>

            <label className="register-field">
              <span>Mobile number <small>Optional</small></span>
              <span className="register-input-wrap">
                <FiPhone aria-hidden="true" />
                <input name="mobile" type="tel" value={form.mobile} onChange={change} autoComplete="tel" placeholder="Enter your mobile number" />
              </span>
            </label>

            <label className="register-field">
              <span>Password</span>
              <span className="register-input-wrap">
                <FiLock aria-hidden="true" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={change} autoComplete="new-password" placeholder="At least 8 characters" minLength="8" required />
                <button className="register-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            <button className="register-submit" disabled={busy} type="submit">
              <span>{busy ? 'Creating account...' : 'Create farmer account'}</span>
              {!busy && <FiArrowRight aria-hidden="true" />}
            </button>
          </form>

          <p className="register-note">By creating an account, you agree to use recommendations as weather-based advisory guidance.</p>
        </div>
      </div>
    </section>
  );
}
