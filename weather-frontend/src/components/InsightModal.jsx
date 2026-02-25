'use client';

import { Sparkles, X, Loader2 } from 'lucide-react';

export default function InsightModal({ cityName, weather, insight, loading, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
  className="glass w-full max-w-sm p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
  onClick={e => e.stopPropagation()}
>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-600/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Insight</h3>
              <p className="text-gray-400 text-xs">{cityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current weather summary */}
        {weather && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
            <span className="text-2xl">{weather.weather[0].icon}</span>
            <div>
              <div className="text-white font-bold">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-gray-400 text-xs capitalize">
                {weather.weather[0].description}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-gray-300 text-xs">Humidity</div>
              <div className="text-white text-sm font-medium">
                {weather.main.humidity}%
              </div>
            </div>
          </div>
        )}

        {/* Insight content */}
        <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl min-h-[80px] max-h-[200px] overflow-y-auto flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <p className="text-purple-300 text-xs">Analyzing weather data...</p>
            </div>
          ) : (
            <p className="text-purple-100 text-sm leading-relaxed">{insight}</p>
          )}
        </div>
      </div>
    </div>
  );
}