import { Link } from 'react-router-dom';
export default function Home() 
{
     return <section className="hero"><div><span className="eyebrow">Weather-smart farming</span><h1>Water crops with confidence, not guesswork.</h1><p>Track farm weather, get clear irrigation advice, and keep a reliable history.</p><div className="actions"><Link className="button" to="/register">Create free account</Link><Link className="button secondary" to="/about">How it works</Link></div></div><div className="hero-card"><span>Today at your farm</span><strong>28 C</strong><p>Monitor weather</p><small>Advice uses live weather and transparent rules.</small></div></section>; }
