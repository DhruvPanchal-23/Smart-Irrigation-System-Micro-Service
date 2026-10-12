import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle, FiBell, FiCamera, FiCheckCircle, FiChevronDown, FiCloudRain,
  FiDroplet, FiEdit3, FiEye, FiEyeOff, FiGlobe, FiInfo, FiLock, FiMail,
  FiMap, FiMapPin, FiPhone, FiPlus, FiSave, FiShield, FiSmartphone,
  FiSun, FiThermometer, FiTrash2, FiUser, FiX,
} from 'react-icons/fi';
import * as authService from '../services/authService.js';
import * as farmService from '../services/farmService.js';
import * as recommendationService from '../services/recommendationService.js';
import useAuth from '../hooks/useAuth.js';

const preferenceDefaults = { temperatureUnit: 'Celsius (°C)', areaUnit: 'Acre', defaultFarm: '', language: 'English', address: 'Baramati, Pune, Maharashtra' };
const notificationDefaults = { weather: true, rain: true, temperature: true, irrigation: true, email: true, sms: false };
const notificationItems = [
  ['weather', 'Weather Alerts', 'Get notified about weather changes', FiSun],
  ['rain', 'Heavy Rain Alerts', 'Alerts for heavy rainfall conditions', FiCloudRain],
  ['temperature', 'High Temperature Alerts', 'Alerts for extreme heat conditions', FiThermometer],
  ['irrigation', 'Irrigation Recommendations', 'Receive timely irrigation guidance', FiDroplet],
  ['email', 'Email Notifications', 'Receive important updates by email', FiMail],
  ['sms', 'SMS Notifications', 'Receive urgent alerts by SMS', FiSmartphone],
];

const readStored = (key, defaults) => {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(key)) }; } catch { return defaults; }
};
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value)) : 'Not available';

function Field({ label, icon: Icon, error, children }) {
  return <label className="profile-field"><span>{Icon && <Icon />}{label}</span>{children}{error && <small className="profile-field-error">{error}</small>}</label>;
}
function PasswordField({ label, registration, error }) {
  const [visible, setVisible] = useState(false);
  return <Field label={label} icon={FiLock} error={error}><span className="password-input"><input type={visible ? 'text' : 'password'} {...registration} /><button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}>{visible ? <FiEyeOff /> : <FiEye />}</button></span></Field>;
}
function StatCard({ icon: Icon, label, value, note, link }) {
  return <article className="profile-stat-card"><span className="profile-stat-icon"><Icon /></span><div><span>{label}</span><strong>{value}</strong>{link ? <Link to="/recommendation">{link}</Link> : <small>{note}</small>}</div></article>;
}
function Select({ value, onChange, children }) {
  return <span className="select-wrap"><select value={value} onChange={onChange}>{children}</select><FiChevronDown /></span>;
}

export default function Profile() {
  const auth = useAuth();
  const [profile, setProfile] = useState(null);
  const [farms, setFarms] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifications, setNotifications] = useState(() => readStored('profile_notifications', notificationDefaults));
  const [preferences, setPreferences] = useState(() => readStored('profile_preferences', preferenceDefaults));
  const [showDelete, setShowDelete] = useState(false);
  const profileForm = useForm({ defaultValues: { name: '', email: '', mobile: '' } });
  const passwordForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [userData, farmData] = await Promise.all([authService.getProfile(), farmService.getFarms()]);
        if (!active) return;
        const items = Array.isArray(farmData) ? farmData : farmData?.items || [];
        setProfile(userData); setFarms(items);
        profileForm.reset({ name: userData.name || '', email: userData.email || '', mobile: userData.mobile || '' });
        if (!preferences.defaultFarm && items[0]) setPreferences((current) => ({ ...current, defaultFarm: items[0]._id }));
        if (items[0]) recommendationService.getLatestRecommendation(items[0]._id).then((item) => active && setLatest(item)).catch(() => {});
      } catch (error) {
        if (active) setPageError(error.response?.data?.message || 'We could not load your profile. Please try again.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => { localStorage.setItem('profile_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('profile_preferences', JSON.stringify(preferences)); }, [preferences]);

  const farmSummary = useMemo(() => {
    const totalArea = farms.reduce((sum, farm) => sum + Number(farm.area || 0), 0);
    const crops = farms.reduce((map, farm) => ({ ...map, [farm.cropType]: (map[farm.cropType] || 0) + 1 }), {});
    return { totalArea: Number.isInteger(totalArea) ? totalArea : totalArea.toFixed(1), mainCrop: Object.entries(crops).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not set' };
  }, [farms]);

  const saveProfile = profileForm.handleSubmit(async ({ name, mobile }) => {
    setSavingProfile(true); setNotice(''); setPageError('');
    try {
      const updated = await authService.updateProfile({ name, mobile });
      setProfile((current) => ({ ...current, ...updated }));
      auth.setUser((current) => ({ ...current, ...updated }));
      setNotice('Your personal information has been updated.');
    } catch (error) { setPageError(error.response?.data?.message || 'Unable to update your profile.'); }
    finally { setSavingProfile(false); }
  });
  const changePassword = passwordForm.handleSubmit(async ({ currentPassword, newPassword }) => {
    setSavingPassword(true); setNotice(''); setPageError('');
    try { await authService.changePassword({ currentPassword, newPassword }); passwordForm.reset(); setNotice('Your password has been updated securely.'); }
    catch (error) { setPageError(error.response?.data?.message || 'Unable to update your password.'); }
    finally { setSavingPassword(false); }
  });

  if (loading) return <div className="profile-loading" role="status"><span /><strong>Loading your profile…</strong></div>;
  const initials = (profile?.name || 'Farmer').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return <div className="profile-page">
    <header className="profile-title-row"><div><span className="profile-eyebrow">Account settings</span><h1>My Profile</h1><p>Manage your personal information, preferences and account settings.</p></div></header>
    {pageError && <div className="profile-alert error" role="alert"><FiAlertTriangle /><span>{pageError}</span><button onClick={() => setPageError('')} aria-label="Dismiss error"><FiX /></button></div>}
    {notice && <div className="profile-alert success" role="status"><FiCheckCircle /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><FiX /></button></div>}

    <section className="profile-hero-card">
      <div className="profile-identity"><div className="profile-photo"><span>{initials}</span><button type="button" aria-label="Change profile photo" title="Photo uploads are not available yet"><FiCamera /></button></div><div><div className="profile-name-line"><h2>{profile?.name || 'Farmer'}</h2><span><FiCheckCircle /> Active Farmer Account</span></div><ul><li><FiMail />{profile?.email || 'Email not available'}</li><li><FiPhone />{profile?.mobile || 'Mobile number not added'}</li><li><FiMapPin />{preferences.address}</li></ul></div></div>
      <div className="profile-meta"><dl><div><dt>Member since</dt><dd>{formatDate(profile?.createdAt)}</dd></div><div><dt>Account type</dt><dd>Farmer account</dd></div><div><dt>Device</dt><dd>Windows • Chrome</dd></div></dl><button type="button" className="profile-primary-button" onClick={() => document.getElementById('personal-information')?.scrollIntoView({ behavior: 'smooth' })}><FiEdit3 /> Edit Profile</button></div>
    </section>

    <section className="profile-stats" aria-label="Farm summary">
      <StatCard icon={FiMap} label="Total Farms" value={profile?.farmCount ?? farms.length} note="Farms added" />
      <StatCard icon={FiMapPin} label="Total Farm Area" value={farmSummary.totalArea} note={preferences.areaUnit === 'Acre' ? 'Acres' : preferences.areaUnit} />
      <StatCard icon={FiDroplet} label="Main Crop" value={farmSummary.mainCrop} note="Current season" />
      <StatCard icon={FiSun} label="Latest Recommendation" value={latest?.title || 'No recommendation'} link={latest ? 'View Details' : null} note="Generate your first advice" />
    </section>
    <div className="profile-farm-actions"><Link to="/farms" className="profile-outline-button"><FiMap /> View My Farms</Link><Link to="/farms/add" className="profile-primary-button"><FiPlus /> Add New Farm</Link></div>

    <div className="profile-content-grid">
      <form id="personal-information" className="profile-card" onSubmit={saveProfile}>
        <div className="profile-card-heading"><span><FiUser /></span><div><h2>Personal Information</h2><p>Update the details used across your account.</p></div></div>
        <div className="profile-form-grid">
          <Field label="Full Name" icon={FiUser} error={profileForm.formState.errors.name?.message}><input {...profileForm.register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Enter at least 2 characters' } })} /></Field>
          <Field label="Email Address" icon={FiMail}><input type="email" disabled {...profileForm.register('email')} /><small>Email cannot be changed</small></Field>
          <Field label="Mobile Number" icon={FiPhone} error={profileForm.formState.errors.mobile?.message}><input {...profileForm.register('mobile', { pattern: { value: /^[+\d\s()-]{7,20}$/, message: 'Enter a valid mobile number' } })} /></Field>
          <Field label="Address" icon={FiMapPin}><input value={preferences.address} onChange={(event) => setPreferences({ ...preferences, address: event.target.value })} /></Field>
          <Field label="Preferred Language" icon={FiGlobe}><Select value={preferences.language} onChange={(event) => setPreferences({ ...preferences, language: event.target.value })}><option>English</option><option>मराठी</option><option>हिन्दी</option></Select></Field>
        </div>
        <div className="profile-form-actions"><button className="profile-primary-button" disabled={savingProfile}><FiSave />{savingProfile ? 'Saving…' : 'Save Changes'}</button><button type="button" className="profile-outline-button" onClick={() => profileForm.reset()}>Cancel</button></div>
      </form>

      <form className="profile-card" onSubmit={changePassword}>
        <div className="profile-card-heading"><span><FiShield /></span><div><h2>Account Security</h2><p>Change Password</p></div></div>
        <div className="password-fields"><PasswordField label="Current Password" registration={passwordForm.register('currentPassword', { required: 'Current password is required' })} error={passwordForm.formState.errors.currentPassword?.message} /><PasswordField label="New Password" registration={passwordForm.register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} error={passwordForm.formState.errors.newPassword?.message} /><PasswordField label="Confirm New Password" registration={passwordForm.register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === passwordForm.getValues('newPassword') || 'Passwords do not match' })} error={passwordForm.formState.errors.confirmPassword?.message} /></div>
        <button className="profile-primary-button" disabled={savingPassword}><FiLock />{savingPassword ? 'Updating…' : 'Update Password'}</button>
        <div className="security-message"><FiShield /><div><strong>Your account is secure</strong><span>We never share your data with anyone.</span></div></div>
      </form>

      <section className="profile-card"><div className="profile-card-heading"><span><FiBell /></span><div><h2>Notification Preferences</h2><p>Choose which updates you want to receive.</p></div></div><div className="notification-list">{notificationItems.map(([key, title, description, Icon]) => <div className="notification-row" key={key}><span className="notification-icon"><Icon /></span><div><strong>{title}</strong><small>{description}</small></div><button type="button" role="switch" aria-checked={notifications[key]} className={`profile-toggle ${notifications[key] ? 'on' : ''}`} onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}><span /></button></div>)}</div></section>

      <section className="profile-card"><div className="profile-card-heading"><span><FiGlobe /></span><div><h2>Application Preferences</h2><p>Personalize units and default selections.</p></div></div><div className="preference-fields">
        <Field label="Preferred Temperature Unit"><Select value={preferences.temperatureUnit} onChange={(event) => setPreferences({ ...preferences, temperatureUnit: event.target.value })}><option>Celsius (°C)</option><option>Fahrenheit (°F)</option></Select></Field>
        <Field label="Preferred Area Unit"><Select value={preferences.areaUnit} onChange={(event) => setPreferences({ ...preferences, areaUnit: event.target.value })}><option>Acre</option><option>Hectare</option></Select></Field>
        <Field label="Default Farm"><Select value={preferences.defaultFarm} onChange={(event) => setPreferences({ ...preferences, defaultFarm: event.target.value })}>{!farms.length && <option value="">No farms available</option>}{farms.map((farm) => <option value={farm._id} key={farm._id}>{farm.farmName}</option>)}</Select></Field>
        <Field label="Preferred Language"><Select value={preferences.language} onChange={(event) => setPreferences({ ...preferences, language: event.target.value })}><option>English</option><option>मराठी</option><option>हिन्दी</option></Select></Field>
      </div></section>
    </div>

    <section className="danger-zone"><div><span><FiTrash2 /></span><div><h2>Danger Zone</h2><p>Deleting your account is permanent and cannot be undone.</p></div></div><button type="button" onClick={() => setShowDelete(true)}><FiTrash2 /> Delete Account</button></section>
    <div className="profile-info-strip"><FiInfo /><span>Keep your profile updated to get better recommendations and alerts.</span></div>
    {showDelete && <div className="profile-modal-backdrop" onMouseDown={() => setShowDelete(false)}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}><span><FiAlertTriangle /></span><h2 id="delete-title">Account deletion unavailable</h2><p>The API does not currently provide a secure account-deletion endpoint. Your account and data have not been changed.</p><button className="profile-primary-button" onClick={() => setShowDelete(false)}>Got it</button></section></div>}
  </div>;
}
