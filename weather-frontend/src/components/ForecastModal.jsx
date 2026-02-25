"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { getForecast } from "@/lib/api";
import { getWeatherIcon, formatTemp, formatDate } from "@/lib/weather";

export default function ForecastModal({ cityName, onClose }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getForecast(cityName)
      .then((res) => setForecast(res.data.data))
      .catch(() => setError("Failed to load forecast"))
      .finally(() => setLoading(false));
  }, [cityName]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-lg p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            5-Day Forecast — {cityName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {error && <p className="text-red-400 text-center py-8">{error}</p>}

        {forecast && (
          <div className="space-y-3">
            {forecast.forecast.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-24 text-gray-300 text-sm font-medium">
                  {i === 0 ? "Today" : formatDate(item.dt)}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-3xl"
                    role="img"
                    aria-label={item.weather[0].description}
                  >
                    {getWeatherIcon(item.weather[0].icon)}
                  </span>
                  <span
                    className="text-gray-400 text-sm capitalize hidden sm:block"
                    style={{ minWidth: "140px" }}
                  >
                    {item.weather[0].description}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {formatTemp(item.main.temp_max)}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatTemp(item.main.temp_min)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
