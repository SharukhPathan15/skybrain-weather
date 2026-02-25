"use client";

import { useState } from "react";
import {
  Star,
  Trash2,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toggleFavorite, deleteCity, getAiInsights } from "@/lib/api";
import {
  getWeatherGradient,
  getWeatherIcon,
  formatTemp,
  getWindDirection,
} from "@/lib/weather";
import ForecastModal from "./ForecastModal";
import ConfirmModal from "@/components/ConfirmModal";
import InsightModal from "./InsightModal";

export default function WeatherCard({ city, weather, onUpdate, onDelete }) {
  const [showForecast, setShowForecast] = useState(false);
  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);

  const handleToggleFavorite = async () => {
    setToggling(true);
    try {
      const res = await toggleFavorite(city._id);
      onUpdate(res.data.city);
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Remove ${city.name} from your dashboard?`)) return;
    try {
      await deleteCity(city._id);
      onDelete(city._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetInsight = async () => {
    setShowInsightModal(true);
    if (insight) return;

    setInsightLoading(true);
    try {
      const res = await getAiInsights(city.name, weather);
      setInsight(res.data.data.insight);
    } catch {
      setInsight("AI insights unavailable right now.");
    } finally {
      setInsightLoading(false);
    }
  };

  const gradient = weather
    ? getWeatherGradient(weather.weather?.[0]?.description)
    : "from-blue-500/20 to-indigo-600/20";

  return (
    <>
      <div
        className={`glass bg-gradient-to-br ${gradient} overflow-hidden group animate-slide-up`}
      >
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                {city.isFavorite && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                )}
                <h3 className="font-bold text-white text-lg leading-tight">
                  {city.name}
                </h3>
              </div>
              {city.country && (
                <p className="text-gray-400 text-sm">{city.country}</p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleFavorite}
                disabled={toggling}
                title={
                  city.isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                className={`p-2 rounded-lg transition-all ${city.isFavorite ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-yellow-400"} hover:bg-white/10`}
              >
                <Star
                  className={`w-4 h-4 ${city.isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                title="Remove city"
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weather Data */}
          {weather ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={weather.weather[0].description}
                >
                  {getWeatherIcon(weather.weather[0].icon)}
                </span>
                <div>
                  <div className="text-4xl font-bold text-white">
                    {formatTemp(weather.main.temp)}
                  </div>
                  <div className="text-gray-300 text-sm capitalize">
                    {weather.weather[0].description}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <StatItem
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                  label="Feels like"
                  value={formatTemp(weather.main.feels_like)}
                />
                <StatItem
                  icon={<Droplets className="w-3.5 h-3.5" />}
                  label="Humidity"
                  value={`${weather.main.humidity}%`}
                />
                <StatItem
                  icon={<Wind className="w-3.5 h-3.5" />}
                  label="Wind"
                  value={`${weather.wind.speed} m/s ${getWindDirection(weather.wind.deg)}`}
                />
                <StatItem
                  icon={<Eye className="w-3.5 h-3.5" />}
                  label="Visibility"
                  value={`${(weather.visibility / 1000).toFixed(1)} km`}
                />
              </div>

              {/* AI Insight */}
              {showInsightModal && (
                <InsightModal
                  cityName={city.name}
                  weather={weather}
                  insight={insight}
                  loading={insightLoading}
                  onClose={() => setShowInsightModal(false)}
                />
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForecast(true)}
                  className="flex-1 text-sm py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  5-Day Forecast
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleGetInsight}
                  disabled={insightLoading}
                  title="Get AI insight"
                  className={`p-2 rounded-xl transition-all ${insight ? "bg-purple-600/30 text-purple-300" : "bg-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300"}`}
                >
                  {insightLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading weather...</p>
            </div>
          )}
        </div>
      </div>

      {showForecast && (
        <ForecastModal
          cityName={city.name}
          onClose={() => setShowForecast(false)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Remove City"
        message={`Remove ${city.name} from your dashboard?`}
        confirmText="Remove"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          try {
            setDeleteLoading(true);
            await deleteCity(city._id);
            onDelete(city._id);
          } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
          }
        }}
        loading={deleteLoading}
      />
    </>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-2.5">
      <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white text-sm font-medium">{value}</div>
    </div>
  );
}
