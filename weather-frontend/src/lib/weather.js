// lib/weather.js

export const getWeatherGradient = (description = '') => {
  const d = description.toLowerCase();
  if (d.includes('clear')) return 'from-orange-500/20 to-yellow-600/20';
  if (d.includes('cloud')) return 'from-gray-500/20 to-slate-600/20';
  if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return 'from-blue-600/20 to-cyan-700/20';
  if (d.includes('snow')) return 'from-blue-200/20 to-indigo-300/20';
  if (d.includes('thunder')) return 'from-purple-700/20 to-gray-800/20';
  if (d.includes('fog')) return 'from-gray-400/20 to-gray-600/20';
  return 'from-blue-500/20 to-indigo-600/20';
};

// Now just returns the emoji directly
export const getWeatherIcon = (icon) => icon;

export const formatTemp = (temp) => `${Math.round(temp)}°C`;

export const getWindDirection = (deg) => {
  if (deg == null) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};