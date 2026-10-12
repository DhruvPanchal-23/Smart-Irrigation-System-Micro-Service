import { useEffect, useMemo, useState } from 'react';
import {
  FiCalendar, FiCloud, FiCloudRain, FiDroplet,
  FiMapPin, FiPause, FiPlay, FiSun, FiWind,
} from 'react-icons/fi';
import RainProbabilityChart from '../components/analytics/RainProbabilityChart.jsx';
import TemperatureHumidityChart from '../components/analytics/TemperatureHumidityChart.jsx';
import WindSpeedChart from '../components/analytics/WindSpeedChart.jsx';
import Loader from '../components/common/Loader.jsx';
import { display } from '../utils/formatters.js';

const DATASET_URL = '/data/smart_irrigation_seed_5_years.json';
const PLAYBACK_INTERVAL_MS = 4000;
const DEMO_DISCLAIMER = 'This recommendation is generated from stored weather records and predefined project rules.';
const safeNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const formatDate = (value, compact = false) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', compact
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const normalizeRecommendationTitle = (record) => (
  record?.title || record?.status?.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
);
export default function Dashboard() {
  const [seedData, setSeedData] = useState(null);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const loadDataset = async () => {
      try {
        const response = await fetch(DATASET_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Dataset request failed with ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.farms) || !Array.isArray(data.weatherHistories) || !Array.isArray(data.recommendations)) {
          throw new Error('Dataset has an invalid structure');
        }
        setSeedData(data);
        setSelectedFarmId(data.farms[0]?._id || '');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError('Unable to load demo weather dataset.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadDataset();
    return () => controller.abort();
  }, []);

  const farms = seedData?.farms || [];
  const weatherHistories = seedData?.weatherHistories || [];
  const recommendations = seedData?.recommendations || [];

  const selectedFarm = useMemo(
    () => farms.find((farm) => farm._id === selectedFarmId),
    [farms, selectedFarmId],
  );
  const farmWeather = useMemo(
    () => weatherHistories
      .filter((record) => record.farm === selectedFarmId)
      .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)),
    [weatherHistories, selectedFarmId],
  );
  const farmRecommendations = useMemo(
    () => recommendations
      .filter((record) => record.farm === selectedFarmId)
      .sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt)),
    [recommendations, selectedFarmId],
  );
  const currentWeather = farmWeather[currentIndex];
  const visibleWeather = useMemo(
    () => farmWeather.slice(Math.max(0, currentIndex - 6), currentIndex + 1),
    [farmWeather, currentIndex],
  );
  const currentRecommendation = useMemo(
    () => farmRecommendations.find((record) => record.weatherSnapshot?.weatherHistoryId === currentWeather?._id),
    [farmRecommendations, currentWeather],
  );
  const weatherTrend = useMemo(
    () => visibleWeather.map((record) => ({
      date: formatDate(record.recordedAt, true),
      temperature: safeNumber(record.temperature),
      humidity: safeNumber(record.humidity),
      rainProbability: safeNumber(record.rainProbability),
      windSpeed: safeNumber(record.windSpeed),
    })),
    [visibleWeather],
  );
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [selectedFarmId]);

  useEffect(() => {
    if (!isPlaying || farmWeather.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => {
        if (index >= farmWeather.length - 1) {
          setIsPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, PLAYBACK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [isPlaying, farmWeather.length]);

  if (loading) return <Loader label="Loading weather history" />;
  if (error) return <section className="card dataset-error" role="alert"><FiCloudRain /><h1>Dataset unavailable</h1><p>{error}</p></section>;

  return (
    <div className="dashboard simulation-dashboard">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-kicker">Historical weather</span>
          <h1>KisanSetu Dashboard</h1>
          <p>Explore five years of farm weather history and stored irrigation advice.</p>
        </div>
        <span className="demo-badge"><FiCloud /> Historical Weather Data</span>
      </section>

      <section className="dashboard-toolbar simulation-toolbar card" aria-label="Simulation settings">
        <label className="farm-selector">
          <span>Selected Farm</span>
          <select value={selectedFarmId} onChange={(event) => setSelectedFarmId(event.target.value)}>
            {farms.map((farm) => <option key={farm._id} value={farm._id}>{farm.farmName}</option>)}
          </select>
        </label>
        <div className="simulation-controls">
          {!isPlaying
            ? <button className="play-button" type="button" onClick={() => setIsPlaying(true)} disabled={currentIndex >= farmWeather.length - 1}><FiPlay /> Play Timeline</button>
            : <button className="play-button" type="button" onClick={() => setIsPlaying(false)}><FiPause /> Pause</button>}
        </div>
      </section>

      {!farmWeather.length ? <section className="card dashboard-inline-empty">No weather records are available for this farm.</section> : <>
        <section className="dashboard-stats weather-summary" aria-label="Current weather record">
          <Metric icon={<FiSun />} color="amber" label="Temperature" value={`${display(currentWeather.temperature)}°C`} />
          <Metric icon={<FiDroplet />} color="cyan" label="Humidity" value={`${display(currentWeather.humidity)}%`} />
          <Metric icon={<FiCloudRain />} color="blue" label="Rain Probability" value={`${display(currentWeather.rainProbability)}%`} />
          <Metric icon={<FiWind />} color="violet" label="Wind Speed" value={`${display(currentWeather.windSpeed)} km/h`} />
          <Metric icon={<FiCloud />} color="indigo" label="Pressure" value={`${display(currentWeather.pressure)} hPa`} />
          <Metric icon={<FiCloud />} color="green" label="Weather Condition" value={display(currentWeather.weatherCondition)} />
          <Metric icon={<FiDroplet />} color="blue" label="Latest Recommendation" value={normalizeRecommendationTitle(currentRecommendation) || 'Not available'} />
          <Metric icon={<FiCalendar />} color="amber" label="Record Date" value={formatDate(currentWeather.recordedAt)} />
        </section>

        <TemperatureHumidityChart data={weatherTrend} periodLabel="7-Day" />
        <RainProbabilityChart data={weatherTrend} periodLabel="7-Day" />
        <WindSpeedChart data={weatherTrend} periodLabel="7-Day" />

        <div className="dashboard-lower-grid simulation-details">
          <FarmInformation farm={selectedFarm} />
          <CurrentRecommendation recommendation={currentRecommendation} />
        </div>
      </>}
    </div>
  );
}

function Metric({ icon, color, label, value }) {
  return <article className="metric-card"><span className={`metric-icon ${color}`}>{icon}</span><div><span>{label}</span><strong>{value}</strong><small>Recorded weather value</small></div></article>;
}

function FarmInformation({ farm }) {
  const fields = [
    ['Farm Name', farm?.farmName],
    ['Crop Type', farm?.cropName || farm?.cropType],
    ['Farm Area', `${display(farm?.area)} ${display(farm?.areaUnit)}`],
    ['Farming Condition', farm?.farmingCondition],
    ['Soil Type', farm?.soilType],
    ['Irrigation Method', farm?.irrigationMethod],
    ['Village', farm?.village],
    ['District', farm?.district],
    ['State', farm?.state],
    ['Latitude', farm?.latitude],
    ['Longitude', farm?.longitude],
  ];
  return <section className="card farm-information"><div className="section-heading"><div><span className="dashboard-label">Selected farm</span><h2>{farm?.farmName}</h2></div><FiMapPin /></div><dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{display(value)}</dd></div>)}</dl></section>;
}

function CurrentRecommendation({ recommendation }) {
  return <section className="recommendation-spotlight simulated-recommendation">
    <div className="spotlight-heading"><div><span className="dashboard-kicker light">Current recommendation</span><h2>{normalizeRecommendationTitle(recommendation) || 'No matching recommendation'}</h2></div>{recommendation && <span className="advice-badge">{normalizeRecommendationTitle(recommendation)}</span>}</div>
    {recommendation ? <>
      <div className="recommendation-copy"><span>Reason</span><p>{recommendation.reason}</p></div>
      <div className="spotlight-action"><span>Recommended Action</span><strong>{recommendation.recommendedAction}</strong></div>
      <div className="recommendation-generated"><FiCalendar /> Generated {formatDate(recommendation.generatedAt)}</div>
    </> : <p>No stored recommendation matches this weather record.</p>}
    <p className="simulation-disclaimer">{DEMO_DISCLAIMER}</p>
  </section>;
}
