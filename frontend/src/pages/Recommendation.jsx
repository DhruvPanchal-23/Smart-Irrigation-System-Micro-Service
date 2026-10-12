import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle, FiBarChart2, FiCheckCircle, FiChevronRight, FiClock,
  FiCloud, FiCloudRain, FiDroplet, FiEye, FiFileText, FiInfo, FiMapPin,
  FiPrinter, FiRefreshCw, FiThermometer, FiTrendingUp, FiWind,
} from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';

const DATASET_URL = '/data/smart_irrigation_seed_5_years.json';
const DISCLAIMER = 'This recommendation uses saved weather records and predefined project rules. It does not use soil-moisture sensors and should not replace professional agricultural advice.';
const STATUS_META = {
  'Irrigate Today': { key: 'irrigate', label: 'Irrigate Today', short: 'IRRIGATE', icon: FiDroplet, meaning: 'The farm requires irrigation.' },
  'Delay Irrigation': { key: 'delay', label: 'Delay Irrigation', short: 'DELAY', icon: FiClock, meaning: 'Postpone irrigation because humidity conditions are high.' },
  'No Irrigation Required': { key: 'none', label: 'No Irrigation Required', short: 'NO IRRIGATION', icon: FiCloudRain, meaning: 'Expected rain or wet conditions make irrigation unnecessary.' },
  'Monitor Weather': { key: 'monitor', label: 'Monitor Weather', short: 'MONITOR', icon: FiEye, meaning: 'No urgent condition exists. Continue observing weather.' },
};

const INSTRUCTIONS = {
  irrigate: ['Inspect irrigation pipes or channels.', 'Check that outlets are not blocked.', 'Begin during the recommended cooler period.', 'Apply water gradually near the root area.', 'Avoid standing water.', 'Stop after the suggested duration.', 'Inspect the farm again after irrigation.'],
  delay: ['Postpone irrigation.', 'Wait until humidity decreases.', 'Monitor rain probability.', 'Check whether rainfall occurs.', 'Generate a new recommendation later.'],
  none: ['Keep the irrigation system off.', 'Monitor expected rainfall.', 'Inspect the field after rainfall.', 'Avoid unnecessary water use.', 'Generate a new recommendation the next day.'],
  monitor: ['Check weather conditions again later.', 'Inspect the crop for visible dryness.', 'Keep the irrigation system ready.', 'Avoid irrigating without a clear need.', 'Generate a fresh recommendation after the next saved reading.'],
};

const formatDate = (value, options = {}) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};
const inputDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';
const inputTime = (value) => value ? new Date(value).toISOString().slice(11, 16) : '';
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const titleOf = (record) => record?.title || record?.status?.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || '';

function weatherLevel(metric, value) {
  if (value === null) return 'Unavailable';
  if (metric === 'temperature') return value > 35 ? 'Very High' : value > 30 ? 'High' : value >= 25 ? 'Medium' : 'Low';
  if (metric === 'humidity') return value > 80 ? 'Very High' : value > 70 ? 'High' : value >= 40 ? 'Medium' : 'Low';
  if (metric === 'rain') return value > 60 ? 'Very High' : value > 40 ? 'High' : value > 20 ? 'Medium' : 'Low';
  if (metric === 'wind') return value > 25 ? 'Very High' : value > 16 ? 'High' : value > 8 ? 'Medium' : 'Safe';
  return 'Recorded';
}

function supportingConfidence(weather, recommendation) {
  if (!weather || !recommendation) return 0;
  const values = [weather.temperature, weather.humidity, weather.rainProbability, weather.windSpeed, weather.pressure];
  let score = 50;
  if (weather.rainProbability > 60 || weather.humidity > 80 || weather.temperature > 35) score += 20;
  if (values.every((value) => number(value) !== null)) score += 10;
  if (recommendation.weatherSnapshot?.weatherHistoryId === weather._id) score += 10;
  const supports = titleOf(recommendation) === 'Irrigate Today'
    ? weather.temperature > 35 && weather.rainProbability <= 60
    : titleOf(recommendation) === 'No Irrigation Required'
      ? weather.rainProbability > 60
      : titleOf(recommendation) === 'Delay Irrigation'
        ? weather.humidity > 80 && weather.rainProbability <= 60
        : weather.temperature <= 35 && weather.humidity <= 80 && weather.rainProbability <= 60;
  if (supports) score += 10;
  return Math.min(100, Math.max(0, score));
}

function confidenceLabel(value) {
  if (value >= 85) return 'Very High Confidence';
  if (value >= 70) return 'High Confidence';
  if (value >= 40) return 'Medium Confidence';
  return 'Low Confidence';
}

function thresholdFor(title) {
  if (title === 'Irrigate Today') return { label: 'Very High', index: 4, reason: 'Temperature is above the project irrigation trigger and higher-priority rules did not match.' };
  if (title === 'Delay Irrigation') return { label: 'Medium', index: 2, reason: 'High humidity indicates irrigation should be postponed and conditions checked again.' };
  if (title === 'No Irrigation Required') return { label: 'Low', index: 1, reason: 'Rain probability is above the project threshold, so irrigation is not currently needed.' };
  return { label: 'Medium', index: 2, reason: 'No urgent trigger matched; continue monitoring the farm and saved weather.' };
}

export default function Recommendation() {
  const [params] = useSearchParams();
  const [dataset, setDataset] = useState(null);
  const [farmId, setFarmId] = useState(params.get('farm') || '');
  const [recordId, setRecordId] = useState('');
  const [analysisDate, setAnalysisDate] = useState('');
  const [analysisTime, setAnalysisTime] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(DATASET_URL, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Dataset request failed');
      return response.json();
    }).then((data) => {
      if (!Array.isArray(data.farms) || !Array.isArray(data.weatherHistories) || !Array.isArray(data.recommendations)) throw new Error('Invalid dataset');
      setDataset(data);
      setFarmId((current) => data.farms.some((farm) => farm._id === current) ? current : (data.farms[0]?._id || ''));
    }).catch((loadError) => {
      if (loadError.name !== 'AbortError') setError('Unable to load the saved recommendation records.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const farms = dataset?.farms || [];
  const selectedFarm = useMemo(() => farms.find((farm) => farm._id === farmId), [farms, farmId]);
  const records = useMemo(() => (dataset?.weatherHistories || [])
    .filter((record) => record.farm === farmId)
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)), [dataset, farmId]);

  useEffect(() => {
    const latest = records[0];
    setRecordId(latest?._id || '');
    setAnalysisDate(inputDate(latest?.recordedAt));
    setAnalysisTime(inputTime(latest?.recordedAt));
    setResult(null);
  }, [records]);

  const selectedRecord = useMemo(() => records.find((record) => record._id === recordId), [records, recordId]);
  const selectRecord = (nextId) => {
    const record = records.find((item) => item._id === nextId);
    setRecordId(nextId);
    setAnalysisDate(inputDate(record?.recordedAt));
    setAnalysisTime(inputTime(record?.recordedAt));
    setResult(null);
  };
  const findByDateTime = (date, time) => {
    const exact = records.find((record) => inputDate(record.recordedAt) === date && (!time || inputTime(record.recordedAt) === time));
    if (exact) selectRecord(exact._id);
  };
  const generate = () => {
    if (!selectedRecord) return;
    setBusy(true); setError('');
    window.setTimeout(() => {
      const recommendation = dataset.recommendations.find((item) => item.farm === farmId && item.weatherSnapshot?.weatherHistoryId === selectedRecord._id);
      if (!recommendation) setError('No saved recommendation is available for this weather record.');
      else setResult({ weather: selectedRecord, recommendation });
      setBusy(false);
    }, 350);
  };

  if (loading) return <Loader label="Loading irrigation advisor" />;

  return <div className="advisor-page">
    <header className="advisor-header">
      <div><div className="advisor-breadcrumb"><Link to="/dashboard">Dashboard</Link><FiChevronRight />Irrigation Advisor</div><h1>Irrigation Recommendation</h1><p>Select a farm and generate practical irrigation advice using saved weather conditions and predefined irrigation rules.</p></div>
      <span className="advisor-demo"><FiCloud /> Historical Weather Data</span>
    </header>

    <section className="advisor-controls" aria-label="Recommendation controls">
      <label><span>Select Farm</span><select value={farmId} onChange={(event) => setFarmId(event.target.value)}>{farms.map((farm) => <option key={farm._id} value={farm._id}>{farm.farmName}</option>)}</select><small>{selectedFarm ? `${selectedFarm.cropName} • ${selectedFarm.area} ${selectedFarm.areaUnit} • ${selectedFarm.village}, ${selectedFarm.district}` : 'Select a farm'}</small></label>
      <label><span>Analysis Date</span><input type="date" value={analysisDate} min={inputDate(records.at(-1)?.recordedAt)} max={inputDate(records[0]?.recordedAt)} onChange={(event) => { setAnalysisDate(event.target.value); findByDateTime(event.target.value, analysisTime); }} /></label>
      <label><span>Analysis Time</span><input type="time" value={analysisTime} onChange={(event) => { setAnalysisTime(event.target.value); findByDateTime(analysisDate, event.target.value); }} /></label>
      <label><span>Data Record</span><select value={recordId} onChange={(event) => selectRecord(event.target.value)}>{records.slice(0, 365).map((record, index) => <option key={record._id} value={record._id}>{index === 0 ? 'Latest • ' : ''}{formatDate(record.recordedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</option>)}</select></label>
      <button type="button" className="advisor-generate" onClick={generate} disabled={!selectedRecord || busy}><FiRefreshCw className={busy ? 'spin' : ''} />{busy ? 'Generating Recommendation...' : 'Generate Recommendation'}</button>
    </section>

    {error && <div className="advisor-error" role="alert"><FiAlertCircle /><div><strong>Unable to generate the irrigation recommendation.</strong><span>{error}</span></div><button type="button" onClick={generate}>Try Again</button></div>}
    {!result ? <section className="advisor-empty"><FiDroplet /><h2>{records.length ? 'Select a farm to generate an irrigation recommendation.' : 'No weather history is available for this farm.'}</h2><p>Choose a saved weather record, then use Generate Recommendation to view the stored project advice.</p></section> : <RecommendationResult result={result} farm={selectedFarm} onGenerate={generate} />}
    <div className="advisor-disclaimer"><FiInfo /><p><strong>Important advisory notice</strong>{DISCLAIMER}</p></div>
  </div>;
}

function RecommendationResult({ result, farm, onGenerate }) {
  const { weather, recommendation } = result;
  const title = titleOf(recommendation);
  const meta = STATUS_META[title] || STATUS_META['Monitor Weather'];
  const StatusIcon = meta.icon;
  const confidence = supportingConfidence(weather, recommendation);
  const threshold = thresholdFor(title);
  const generated = recommendation.generatedAt || weather.recordedAt;
  const duration = title === 'Irrigate Today' ? 45 : title === 'Monitor Weather' ? 20 : 0;
  const start = new Date(weather.recordedAt);
  const stop = new Date(start.getTime() + duration * 60000);
  const instructionTitle = meta.key === 'irrigate' ? 'How to Irrigate' : meta.key === 'delay' ? 'Why You Should Wait' : meta.key === 'none' ? 'No Irrigation Needed' : 'Continue Monitoring';
  const metrics = [
    ['Temperature', FiThermometer, number(weather.temperature), '°C', weatherLevel('temperature', number(weather.temperature))],
    ['Humidity', FiDroplet, number(weather.humidity), '%', weatherLevel('humidity', number(weather.humidity))],
    ['Rain Probability', FiCloudRain, number(weather.rainProbability), '%', weatherLevel('rain', number(weather.rainProbability))],
    ['Wind Speed', FiWind, number(weather.windSpeed), ' km/h', weatherLevel('wind', number(weather.windSpeed))],
    ['Pressure', FiBarChart2, number(weather.pressure), ' hPa', 'Recorded'],
    ['Condition', FiCloud, weather.weatherCondition, '', 'Observed'],
  ];

  return <div className="advisor-results">
    <div className="advisor-result-grid">
      <section className={`advisor-result advisor-${meta.key}`}>
        <div className="advisor-result-top"><span className="advisor-result-icon"><StatusIcon /></span><div><span className="advisor-status">{meta.short}</span><h2>{meta.label}</h2><p>{meta.meaning}</p></div></div>
        <p className="advisor-reason">{recommendation.reason}</p>
        <dl><div><dt>Recommended action</dt><dd>{recommendation.recommendedAction}</dd></div><div><dt>Generated</dt><dd>{formatDate(generated, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</dd></div><div><dt>Data source</dt><dd>Saved weather history for {farm.farmName}</dd></div></dl>
      </section>
      <section className="advisor-quality">
        <div><span className="advisor-section-label">Confidence</span><strong>{confidence}%</strong><b>{confidenceLabel(confidence)}</b><div className="advisor-progress"><span style={{ width: `${confidence}%` }} /></div><p>The saved weather fields and matching history record consistently support this recommendation.</p></div>
        <div><span className="advisor-section-label">Irrigation Threshold</span><strong>{threshold.label}</strong><div className="threshold-segments" aria-label={`${threshold.label} threshold`}>{[1, 2, 3, 4].map((level) => <i key={level} className={level <= threshold.index ? 'active' : ''} />)}</div><p>{threshold.reason}</p></div>
      </section>
    </div>

    <Section title="Weather Conditions Used" icon={FiCloud} description="Saved values used by the stored recommendation.">
      <div className="advisor-metrics">{metrics.map(([label, Icon, value, unit, level]) => <article key={label}><Icon /><span>{label}</span><strong>{value ?? 'Not available'}{value !== null && value !== undefined ? unit : ''}</strong><small>{level}</small></article>)}</div>
    </Section>

    <div className="advisor-two-column">
      <Section title="Best Irrigation Method" icon={FiDroplet}><div className="method-primary"><span>Recommended Method</span><h3>{farm.irrigationMethod || 'Drip irrigation'}</h3><p>Apply water slowly near the plant root zone to reduce evaporation and unnecessary loss.</p></div><dl className="advisor-compact"><div><dt>Suitability</dt><dd>Controlled watering for {farm.cropName}</dd></div><div><dt>Water efficiency</dt><dd>High when correctly maintained</dd></div><div><dt>Important caution</dt><dd>Inspect outlets and check for blockage before starting.</dd></div><div><dt>Alternative</dt><dd>Furrow irrigation only when controlled irrigation is unavailable.</dd></div></dl></Section>
      <Section title="Recommended Irrigation Time" icon={FiClock}><dl className="advisor-schedule"><div><dt>Best time</dt><dd>6:00 AM to 8:00 AM</dd></div><div><dt>Second option</dt><dd>5:30 PM to 7:00 PM</dd></div><div><dt>Avoid</dt><dd>11:00 AM to 4:00 PM</dd></div><div><dt>Recommended date</dt><dd>{formatDate(weather.recordedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div><div><dt>Recheck conditions</dt><dd>After 12 hours</dd></div></dl><p className="advisor-note">Midday irrigation can increase evaporation and reduce water efficiency.</p></Section>
    </div>

    <Section title="Suggested Irrigation Plan" icon={FiTrendingUp} description="Estimated Demonstration Guidance — not an exact real-world water requirement."><div className="advisor-plan"><div><span>Water level</span><strong>{duration ? 'Moderate' : 'None advised'}</strong></div><div><span>Flow</span><strong>{duration ? 'Controlled / Normal' : 'Keep off'}</strong></div><div><span>Suggested duration</span><strong>{duration ? `${duration} minutes` : 'Not applicable'}</strong></div><div><span>Coverage</span><strong>{duration ? 'Selected irrigation zone' : 'No irrigation'}</strong></div><div><span>Start</span><strong>{duration ? formatDate(start, { hour: 'numeric', minute: '2-digit' }) : 'Not applicable'}</strong></div><div><span>Stop</span><strong>{duration ? formatDate(stop, { hour: 'numeric', minute: '2-digit' }) : 'Not applicable'}</strong></div></div></Section>

    <Section title={instructionTitle} icon={FiFileText}><ol className="advisor-steps">{INSTRUCTIONS[meta.key].map((step) => <li key={step}><span>{INSTRUCTIONS[meta.key].indexOf(step) + 1}</span><p>{step}</p></li>)}</ol></Section>

    <details className="advisor-more-details">
      <summary><span><FiInfo /><b>Additional recommendation details</b><small>Rules, farm information, thresholds, and confidence methodology</small></span><FiChevronRight /></summary>
      <div className="advisor-more-content">
        <div className="advisor-two-column">
          <Section title="Why this recommendation was generated" icon={FiCheckCircle}><ul className="advisor-checks"><li className={weather.rainProbability > 60 ? 'matched' : ''}>Rain probability {weather.rainProbability > 60 ? 'is above' : 'is not above'} 60%</li><li className={weather.humidity > 80 && weather.rainProbability <= 60 ? 'matched' : ''}>Humidity {weather.humidity > 80 ? 'is above' : 'is not above'} 80%</li><li className={weather.temperature > 35 && weather.humidity <= 80 && weather.rainProbability <= 60 ? 'matched' : ''}>Temperature {weather.temperature > 35 ? 'is above' : 'is not above'} 35°C</li><li className="matched">Stored result: {title}</li></ul><p className="advisor-note">Rules are evaluated in rain, humidity, temperature, then default priority. The frontend displays the stored result and does not create a different official recommendation.</p></Section>
          <Section title="Farm and Crop Information" icon={FiMapPin}><dl className="advisor-farm-details"><div><dt>Farm</dt><dd>{farm.farmName}</dd></div><div><dt>Crop</dt><dd>{farm.cropName}</dd></div><div><dt>Area</dt><dd>{farm.area} {farm.areaUnit}</dd></div><div><dt>Soil type</dt><dd>{farm.soilType}</dd></div><div><dt>Condition</dt><dd>{farm.farmingCondition}</dd></div><div><dt>Existing method</dt><dd>{farm.irrigationMethod}</dd></div></dl><p className="advisor-note">General project guidance: prefer controlled root-zone watering, avoid frequent shallow watering and waterlogging, reduce irrigation as rain probability rises, and irrigate during cooler hours.</p></Section>
        </div>
        <div className="advisor-two-column advisor-tables">
          <Section title="Threshold Levels" icon={FiBarChart2}><div className="table-wrap"><table><thead><tr><th>Level</th><th>Meaning</th><th>Suggested Action</th></tr></thead><tbody><tr><td>Low</td><td>No immediate need</td><td>Continue monitoring</td></tr><tr><td>Medium</td><td>Possible irrigation need</td><td>Inspect field and weather</td></tr><tr><td>High</td><td>Irrigation likely needed</td><td>Prepare irrigation</td></tr><tr><td>Very High</td><td>Urgent condition</td><td>Act at recommended time</td></tr></tbody></table></div></Section>
          <Section title="Weather Indicator Categories" icon={FiThermometer}><div className="table-wrap"><table><thead><tr><th>Metric</th><th>Low</th><th>Medium</th><th>High</th><th>Very High</th></tr></thead><tbody><tr><td>Temperature</td><td>&lt;25°C</td><td>25–30°C</td><td>31–35°C</td><td>&gt;35°C</td></tr><tr><td>Humidity</td><td>&lt;40%</td><td>40–70%</td><td>71–80%</td><td>&gt;80%</td></tr><tr><td>Rain</td><td>0–20%</td><td>21–40%</td><td>41–60%</td><td>&gt;60%</td></tr><tr><td>Wind</td><td>0–8</td><td>9–16</td><td>17–25</td><td>&gt;25 km/h</td></tr></tbody></table></div><p className="advisor-note">These labels are project display categories, not certified agronomic thresholds.</p></Section>
        </div>
        <div className="advisor-confidence-copy"><h3>How confidence is calculated</h3><p>Confidence starts at 50 points. It adds points for a clearly triggered rule, supporting indicators, complete weather data, and a matching saved history record. Missing or conflicting data reduces the score. It is capped between 0 and 100.</p><strong>Confidence is a supporting quality indicator only. The official recommendation remains the stored recommendation status.</strong></div>
      </div>
    </details>

    <div className="advisor-actions"><button type="button" className="advisor-primary" onClick={onGenerate}><FiRefreshCw />Generate New Recommendation</button><Link to={`/history?farm=${farm._id}`}><FiFileText />View Recommendation History</Link><Link to={`/farms/${farm._id}`}><FiMapPin />View Farm</Link><Link to={`/weather?farm=${farm._id}`}><FiCloud />View Weather Record</Link><button type="button" onClick={() => window.print()}><FiPrinter />Print Recommendation</button></div>
  </div>;
}

function Section({ title, icon: Icon, description, children }) {
  return <section className="advisor-section"><header><span><Icon /></span><div><h2>{title}</h2>{description && <p>{description}</p>}</div></header>{children}</section>;
}
