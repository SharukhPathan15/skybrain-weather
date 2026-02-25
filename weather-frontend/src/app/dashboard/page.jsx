'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, getCities, getBulkWeather } from '@/lib/api';
import Navbar from '@/components/Navbar';
import WeatherCard from '@/components/WeatherCard';
import AddCity from '@/components/AddCity';
import AIChat from '@/components/AIChat';
import { Star, Cloud, RefreshCw, Loader2, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [weatherMap, setWeatherMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    getMe()
      .then(res => {
        setUser(res.data.user);
        loadCities();
      })
      .catch(() => router.push('/login'));
  }, []);

  const loadCities = async () => {
    try {
      const res = await getCities();
      setCities(res.data.cities);         
      if (res.data.cities.length > 0) {
        fetchWeatherForCities(res.data.cities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForCities = async (cityList) => {
    try {
      const res = await getBulkWeather(cityList);
      const map = {};
      res.data.data.forEach(item => {
        if (item.data) map[item.cityId] = item.data;
      });
      setWeatherMap(prev => ({ ...prev, ...map }));  
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherForCities(cities);
    setRefreshing(false);
  };

  const handleCityAdded = (newCity) => {
    setCities(prev => [newCity, ...prev]);
    fetchWeatherForCities([newCity]);
  };

  const handleCityUpdate = (updatedCity) => {
    setCities(prev => prev.map(c => c._id === updatedCity._id ? updatedCity : c));
  };

  const handleCityDelete = (cityId) => {
    setCities(prev => prev.filter(c => c._id !== cityId));
    setWeatherMap(prev => {
      const next = { ...prev };
      delete next[cityId];
      return next;
    });
  };

  const displayedCities = filter === 'favorites'
    ? cities.filter(c => c.isFavorite)
    : cities;

  const favoriteCount = cities.filter(c => c.isFavorite).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950">
      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Good {getTimeGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-400">
            {cities.length === 0
              ? 'Add your first city to get started'
              : `Tracking ${cities.length} ${cities.length === 1 ? 'city' : 'cities'}${favoriteCount > 0 ? ` · ${favoriteCount} favorite${favoriteCount > 1 ? 's' : ''}` : ''}`
            }
          </p>
        </div>

        {/* Add City & Controls */}
        <div className="bg-black p-4 mb-6 relative z-40">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <AddCity onCityAdded={handleCityAdded} />
            </div>
            <div className="flex items-center gap-2">
              {/* Filter buttons */}
              <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('favorites')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'favorites' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Favorites</span>
                  {favoriteCount > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === 'favorites' ? 'bg-white/20' : 'bg-white/10'}`}>
                      {favoriteCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {filter === 'all' && favoriteCount > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.filter(c => c.isFavorite).map(city => (
                <WeatherCard
                  key={city._id}
                  city={city}
                  weather={weatherMap[city._id]}
                  onUpdate={handleCityUpdate}
                  onDelete={handleCityDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* All / Other Cities */}
        {displayedCities.length > 0 ? (
          <div>
            {filter === 'all' && favoriteCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">All Cities</h2>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(filter === 'all' ? cities.filter(c => !c.isFavorite) : displayedCities).map(city => (
                <WeatherCard
                  key={city._id}
                  city={city}
                  weather={weatherMap[city._id]}
                  onUpdate={handleCityUpdate}
                  onDelete={handleCityDelete}
                />
              ))}
            </div>
          </div>
        ) : cities.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No cities yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Search for a city above to add it to your personal weather dashboard.
            </p>
          </div>
        ) : (
          // No favorites state
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Click the star icon on any city card to add it to your favorites.
            </p>
          </div>
        )}
      </main>

      {/* AI Chat */}
      <AIChat cities={cities} weatherMap={weatherMap} />
    </div>
  );
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
