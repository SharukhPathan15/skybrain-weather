"use client";

import { useState, useRef } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { searchCities, addCity } from "@/lib/api";


export default function AddCity({ onCityAdded }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);
    setError("");
    clearTimeout(searchTimeout.current);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchCities(value);
        setSuggestions(res.data.data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelect = async (city) => {
    setShowSuggestions(false);
    setAdding(true);
    setError("");
    try {
      const newCity = await addCity({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      });
      setQuery("");
      setSuggestions([]);
      onCityAdded(newCity.data.city);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add city");
    } finally {
      setAdding(false);
    }
  };

  const handleManualAdd = async () => {
    if (!query.trim()) return;
    setAdding(true);
    setError("");
    try {
      const newCity = await addCity({ name: query.trim() });
      setQuery("");
      setSuggestions([]);
      onCityAdded(newCity.data.city);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add city");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="relative z-50">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="input pl-10"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>
        <button
          onClick={handleManualAdd}
          disabled={!query.trim() || adding}
          className="btn-primary flex items-center gap-1.5 px-4"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 glass overflow-hidden z-50 shadow-2xl animate-slide-up">
          {suggestions.map((city, i) => (
            <button
              key={i}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3"
            >
              <span className="text-lg">{getFlagEmoji(city.country)}</span>
              <div>
                <div className="text-white font-medium text-sm">
                  {city.name}
                </div>
                <div className="text-gray-400 text-xs">
                  {city.state ? `${city.state}, ` : ""}
                  {city.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
    </div>
  );
}

function getFlagEmoji(country) {
  try {
    return country
      .toUpperCase()
      .split("")
      .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
      .join("");
  } catch {
    return "🌍";
  }
}
