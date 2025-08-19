import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";

const deviceData = [
  { date: "Oct 5", android: 380, iphone: 150 },
  { date: "Oct 10", android: 250, iphone: 100 },
  { date: "Oct 15", android: 450, iphone: 200 },
  { date: "Oct 20", android: 250, iphone: 100 },
  { date: "Oct 25", android: 500, iphone: 200 },
  { date: "Oct 30", android: 350, iphone: 150 },
];

const crashData = [
  { date: "Oct 5", line1: 350, line2: 320 },
  { date: "Oct 10", line1: 300, line2: 280 },
  { date: "Oct 15", line1: 450, line2: 400 },
  { date: "Oct 20", line1: 250, line2: 230 },
  { date: "Oct 25", line1: 400, line2: 350 },
  { date: "Oct 30", line1: 300, line2: 280 },
];

export default function Dashboard() {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    onlineUsers: 0
  });
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animeStats, setAnimeStats] = useState({
    totalAnimes: 0,
    totalSeries: 0,
    totalMovies: 0
  });
  const [viewedAnalytics, setViewedAnalytics] = useState([]);
  const [adminUser, setAdminUser] = useState({ username: 'Admin' });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        console.log('Fetching user stats from:', 'http://localhost:3000/user_stats');
        const response = await fetch('http://localhost:8080/user_stats', {
          credentials: 'include'
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API Response:', data);
        if (data.bool) {
          console.log('Setting user stats:', { totalUsers: data.totalUsers, onlineUsers: data.onlineUsers });
          setUserStats({
            totalUsers: data.totalUsers,
            onlineUsers: data.onlineUsers
          });
          if (data.adminUser) {
            setAdminUser({ username: data.adminUser.username });
          }
        } else {
          console.log('API returned bool: false, message:', data.msg);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };
    const fetchPopularAnimes = async () => {
      try {
        console.log('Fetching animes...');
        const [seriesRes, moviesRes] = await Promise.all([
          fetch('http://localhost:8080/get_series'),
          fetch('http://localhost:8080/get_movies')
        ]);
        console.log('Series response status:', seriesRes.status);
        console.log('Movies response status:', moviesRes.status);
        
        const seriesData = await seriesRes.json();
        const moviesData = await moviesRes.json();
        console.log('Series data:', seriesData);
        console.log('Movies data:', moviesData);
        
        const allAnimes = [...(seriesData || []), ...(moviesData || [])];
        console.log('All animes count:', allAnimes.length);
        
        const topAnimes = allAnimes
          .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
          .slice(0, 15);
        console.log('Top animes:', topAnimes);
        
        setPopularAnimes(topAnimes);
      } catch (error) {
        console.error('Failed to fetch popular animes:', error);
      }
    };

    const fetchAnimeStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/anime_stats', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.bool) {
          setAnimeStats({
            totalAnimes: data.totalAnimes,
            totalSeries: data.totalSeries,
            totalMovies: data.totalMovies
          });
        }
      } catch (error) {
        console.error('Failed to fetch anime stats:', error);
      }
    };

    const fetchViewedAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:8080/viewed_analytics', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.bool) {
          const topViewed = data.analytics
            .sort((a, b) => b.avg_rating - a.avg_rating)
            .slice(0, 5);
          setViewedAnalytics(topViewed);
        }
      } catch (error) {
        console.error('Failed to fetch viewed analytics:', error);
      }
    };

    fetchUserStats();
    fetchPopularAnimes();
    fetchAnimeStats();
    fetchViewedAnalytics();
  }, []);

  return (
    <Layout>
      <div className="p-6 pt-4">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Total Users Card */}
            <div className="bg-gray-800 border-2 border-red-500 rounded-2xl p-6">
              <div className="text-red-300 text-sm font-medium mb-3">TOTAL USERS</div>
              <div className="text-5xl font-bold mb-6">{userStats.totalUsers.toLocaleString()}</div>
              <div className="flex">
                <div className="flex-1">
                  <div className="text-white text-sm mb-1">Online Users</div>
                  <div className="text-3xl font-bold">{userStats.onlineUsers}</div>
                </div>
                <div className="w-px bg-white/30 mx-4"></div>
                <div className="flex-1">
                  <div className="text-white text-sm mb-1">Active %</div>
                  <div className="text-3xl font-bold">{userStats.totalUsers > 0 ? ((userStats.onlineUsers / userStats.totalUsers) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </div>

            {/* Total Animes */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="text-red-300 text-sm font-medium mb-4">Total Animes</div>
              <div className="relative h-40 flex items-center justify-center">
                <div className="relative">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <defs>
                        <linearGradient id="seriesGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="moviesGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f87171" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                      <Pie 
                        data={[
                          {name: 'Series', value: animeStats.totalSeries},
                          {name: 'Movies', value: animeStats.totalMovies}
                        ]} 
                        innerRadius={45} 
                        outerRadius={80} 
                        dataKey="value"
                        startAngle={-90}
                        paddingAngle={2}
                        stroke="none"
                      >
                        <Cell fill="url(#seriesGradient)" />
                        <Cell fill="url(#moviesGradient)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-white">{animeStats.totalAnimes}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-sm mt-3">
                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mr-2 shadow-lg"></div>
                  <span className="text-blue-300">{animeStats.totalSeries} Series</span>
                </div>
                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-700 rounded-full mr-2 shadow-lg"></div>
                  <span className="text-red-300">{animeStats.totalMovies} Movies</span>
                </div>
              </div>
            </div>

            {/* Popular Animes */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="text-red-300 text-sm font-medium mb-4">Popular Animes</div>
              <div className="flex items-center justify-between mb-4">
                <ChevronLeft 
                  size={20} 
                  className={`cursor-pointer ${currentIndex > 0 ? 'text-white hover:text-red-300' : 'text-gray-600'}`}
                  onClick={() => {
                    if (currentIndex > 0 && !isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(currentIndex - 1);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                />
                <div className="flex space-x-2 overflow-hidden relative" style={{width: '216px', height: '96px'}}>
                  <div 
                    className="flex space-x-2 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * 72}px)`
                    }}
                  >
                    {popularAnimes.map((anime, index) => {
                      const position = index - currentIndex;
                      return (
                        <div 
                          key={anime._id} 
                          className="flex flex-col items-center flex-shrink-0"
                        >
                          <div className={`${position === 1 ? 'w-20 h-20' : 'w-16 h-16'} bg-gray-700 rounded-xl overflow-hidden mb-1 transition-all duration-500`}>
                        <img 
                          src={anime.cover_image || anime.big_image} 
                          alt={anime.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-red-500 rounded-xl hidden items-center justify-center text-white font-bold text-xs">
                          {anime.name?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <div className={`text-xs text-center text-gray-300 truncate ${position === 1 ? 'w-20' : 'w-16'}`}>
                        ⭐{anime.avg_rating?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                    );
                  })}
                  </div>
                  {popularAnimes.length === 0 && (
                    <div className="text-gray-400 text-sm absolute inset-0 flex items-center justify-center">Loading...</div>
                  )}
                </div>
                <ChevronRight 
                  size={20} 
                  className={`cursor-pointer ${currentIndex + 3 < popularAnimes.length ? 'text-white hover:text-red-300' : 'text-gray-600'}`}
                  onClick={() => {
                    if (currentIndex + 3 < popularAnimes.length && !isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(currentIndex + 1);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 text-center">
                Top {popularAnimes.length} highest rated animes
              </div>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Animes by Rating */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="text-white font-medium mb-6">Top Animes by Rating - Viewer Count</div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={viewedAnalytics} barCategoryGap="20%" margin={{ bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#fff', fontSize: 12}}
                    />
                    <Bar dataKey="viewerCount" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-between px-12 mt-2">
                  {viewedAnalytics.map((anime, index) => (
                    <div key={anime.animeId} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden mb-1">
                        <img 
                          src={anime.cover_image || anime.big_image} 
                          alt={anime.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-red-500 rounded-lg hidden items-center justify-center text-white font-bold text-xs">
                          {anime.name?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <div className="text-xs text-center text-gray-300 w-12 truncate">{anime.name}</div>
                      <div className="text-xs text-yellow-400">⭐{anime.avg_rating?.toFixed(1)}</div>
                      <div className="text-xs text-blue-400">{anime.viewerCount} views</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Crashes Reports */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="text-white font-medium mb-6">Total Crashes Reports</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={crashData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#fff', fontSize: 12}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#fff', fontSize: 12}}
                    domain={[100, 600]}
                    ticks={[100, 200, 300, 400, 500, 600]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="line1" 
                    stroke="#ef4444" 
                    strokeWidth={4} 
                    dot={false}
                    strokeLinecap="round"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="line2" 
                    stroke="#dc2626" 
                    strokeWidth={4} 
                    dot={false}
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </Layout>
  );
}