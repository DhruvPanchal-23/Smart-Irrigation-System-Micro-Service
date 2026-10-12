const output = (status, title, reason, recommendedAction) => ({ status, title, reason, recommendedAction });
export const evaluateIrrigation = ({ rainProbability = 0, humidity = 0, temperature = 0 }) => {
  if (rainProbability > 60) return output('no_irrigation', 'No Irrigation Required', 'Rain is likely, so additional irrigation may waste water.', 'Skip irrigation and monitor rainfall.');
  if (humidity > 80) return output('delay_irrigation', 'Delay Irrigation', 'High humidity reduces immediate crop water loss.', 'Delay irrigation and review conditions later.');
  if (temperature > 35) return output('irrigate_today', 'Irrigate Today', 'High temperature increases crop water demand.', 'Irrigate during the cooler part of the day.');
  return output('monitor_weather', 'Monitor Weather', 'Current conditions do not require an immediate change.', 'Continue monitoring weather and soil conditions.');
};
