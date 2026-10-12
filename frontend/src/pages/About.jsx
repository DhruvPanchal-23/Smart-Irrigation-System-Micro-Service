import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiCloudRain, FiDroplet, FiMapPin, FiShield, FiSun } from 'react-icons/fi';

const stages = [
  ['01', 'Before planting', 'Prepare the field', 'Test the soil, improve drainage, add well-decomposed organic matter, and prepare level furrows or trenches.'],
  ['02', 'Planting', 'Plant healthy setts', 'Use healthy, locally recommended seed cane. Place setts evenly, maintain suitable spacing, and cover lightly with soil.'],
  ['03', 'Germination', 'Support establishment', 'Keep the root zone evenly moist without waterlogging. Inspect gaps and manage weeds while the crop establishes.'],
  ['04', 'Tillering & growth', 'Build the crop', 'Apply nutrients in planned splits, earth up the rows, remove competing weeds, and protect the crop from stress.'],
  ['05', 'Ripening', 'Mature and harvest', 'Avoid unnecessary late watering, watch crop maturity, and harvest at the locally recommended stage for good sugar recovery.'],
];

const methods = [
  [FiDroplet, 'Most water-efficient', 'Drip irrigation', 'Delivers water near the root zone in smaller, controlled amounts. It can reduce evaporation and enables fertigation when correctly designed.', 'green'],
  [FiCloudRain, 'Common field method', 'Furrow irrigation', 'Water moves through furrows beside the cane rows. Good levelling, shorter runs, and controlled flow help limit runoff and deep percolation.', 'blue'],
  [FiSun, 'Practical water saver', 'Alternate-furrow irrigation', 'Only alternate furrows are watered during an irrigation event. Suitability depends on soil, field layout, crop stage, and local guidance.', 'amber'],
];

const practices = [
  'Choose a variety recommended for the local climate and planting season.',
  'Use healthy seed cane and treat setts according to local extension advice.',
  'Keep the field well drained—sugarcane needs moisture but suffers in standing water.',
  'Use mulching or retained trash where locally suitable to slow evaporation and suppress weeds.',
  'Inspect regularly for weeds, nutrient stress, lodging, pests, and diseases.',
  'Base fertilizer and crop-protection decisions on soil tests and qualified local advice.',
];

export default function About() {
  return <div className="about-page">
    <section className="about-hero" aria-labelledby="about-title">
      <div className="about-hero-copy"><span className="about-kicker">Sugarcane growing guide</span><h1 id="about-title">Grow healthier sugarcane with every drop in mind.</h1><p>Sugarcane is a long-duration, water-demanding crop. Better results come from healthy planting material, timely field care, good drainage, and irrigation decisions that respond to weather, soil, and crop stage.</p><div className="about-actions"><Link className="button" to="/register">Start with KisanSetu <FiArrowRight aria-hidden="true" /></Link><a className="about-text-link" href="#growing-method">Explore the growing method</a></div></div>
      <div className="about-field-card" aria-label="Sugarcane crop overview"><div className="about-sun" aria-hidden="true" /><div className="about-cane" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="about-field-card-content"><span>Think in seasons, not days</span><strong>Soil + crop stage + weather</strong><p>Use all three before deciding when and how much to irrigate.</p></div></div>
    </section>

    <section className="about-intro" aria-labelledby="sugarcane-heading"><div><span className="about-kicker">Understanding the crop</span><h2 id="sugarcane-heading">What makes sugarcane farming different?</h2></div><p>Sugarcane is a tall perennial grass grown from pieces of mature stalk called setts. Its roots need both moisture and air, while its long growth cycle means field conditions can change greatly between planting and harvest. A successful plan therefore combines crop observation with local weather and soil knowledge.</p></section>

    <section className="about-principles" aria-label="Sugarcane farming principles">
      <article><span><FiMapPin aria-hidden="true" /></span><h3>Start with the field</h3><p>Soil texture, slope, drainage, and water quality shape every later decision.</p></article>
      <article><span><FiDroplet aria-hidden="true" /></span><h3>Protect the root zone</h3><p>Aim for useful moisture near the roots—neither prolonged dryness nor standing water.</p></article>
      <article><span><FiCloudRain aria-hidden="true" /></span><h3>Respond to conditions</h3><p>Check recent rain and forecast conditions before irrigating to avoid preventable water loss.</p></article>
    </section>

    <section className="about-section" id="growing-method" aria-labelledby="method-heading"><header className="about-section-heading"><div><span className="about-kicker">From field to harvest</span><h2 id="method-heading">A practical sugarcane farming method</h2></div><p>Exact timing and inputs vary by region, variety, season, soil, and water availability.</p></header><ol className="about-timeline">{stages.map(([number, period, title, description]) => <li key={number}><span className="about-stage-number">{number}</span><div><small>{period}</small><h3>{title}</h3><p>{description}</p></div></li>)}</ol></section>

    <section className="about-irrigation" aria-labelledby="irrigation-heading"><div className="about-irrigation-copy"><span className="about-kicker light">Irrigation strategy</span><h2 id="irrigation-heading">Water according to need—not the calendar alone.</h2><p>Young cane needs dependable moisture to establish. Water demand rises as the canopy and stalks develop, then usually falls as the crop approaches maturity. Rainfall, temperature, soil type, and drainage can shift every irrigation decision.</p><div className="about-water-rule"><FiShield aria-hidden="true" /><p><strong>Before irrigating:</strong> inspect soil moisture, check recent and expected rain, and look for crop stress or waterlogging.</p></div></div><div className="about-stage-needs" aria-label="Irrigation priorities by crop stage"><div><span>Establishment</span><strong>Keep moisture dependable</strong><i className="level medium" /></div><div><span>Tillering</span><strong>Avoid moisture stress</strong><i className="level high" /></div><div><span>Grand growth</span><strong>Highest attention to water</strong><i className="level full" /></div><div><span>Maturity</span><strong>Reduce excess watering</strong><i className="level low" /></div></div></section>

    <section className="about-section" aria-labelledby="methods-heading"><header className="about-section-heading compact"><div><span className="about-kicker">Choose the right delivery method</span><h2 id="methods-heading">Common irrigation methods</h2></div></header><div className="about-method-grid">{methods.map(([Icon, label, title, description, color]) => <article key={title} className={`about-method-card ${color}`}><span className="about-method-icon"><Icon aria-hidden="true" /></span><small>{label}</small><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="about-practice-section" aria-labelledby="practice-heading"><div className="about-practice-copy"><span className="about-kicker">Good field habits</span><h2 id="practice-heading">Small practices protect the whole season.</h2><p>Consistent observation is as important as any single technique. Keep simple records of irrigation, rainfall, fertilizer, crop condition, and harvest results so the next crop can improve on the last.</p></div><ul className="about-checklist">{practices.map((practice) => <li key={practice}><span><FiCheck aria-hidden="true" /></span>{practice}</li>)}</ul></section>

    <section className="about-cta" aria-labelledby="about-cta-heading"><div><span className="about-kicker light">Farm with better context</span><h2 id="about-cta-heading">Turn farm weather into a clearer irrigation decision.</h2><p>KisanSetu helps you map a farm, review weather, and receive transparent rule-based guidance.</p></div><Link className="button" to="/register">Create your farm account <FiArrowRight aria-hidden="true" /></Link></section>
    <aside className="about-disclaimer"><FiShield aria-hidden="true" /><p><strong>Important:</strong> This guide provides general educational information. Local soil tests, water quality, crop variety, regulations, and advice from qualified agricultural extension professionals should guide field decisions.</p></aside>
  </div>;
}
