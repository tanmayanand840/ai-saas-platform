import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { GemIcon, Sparkles, TrendingUp, Calendar, BarChart3, Activity } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if (data.success) {
        setCreations(data.creations);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Calculate additional stats for enhanced display
  const recentCreations = creations.filter(creation => {
    const creationDate = new Date(creation.createdAt || creation.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return creationDate >= sevenDaysAgo;
  }).length;

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-slate-600 font-medium">Loading your creations...</p>
      <p className="text-sm text-slate-400">This may take a moment</p>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, gradient, trend, description }) => (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300" style={{
        backgroundImage: gradient
      }}></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
            {description && (
              <p className="text-xs text-slate-400">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center transform rotate-12">
        <Sparkles className="w-12 h-12 text-slate-400 transform -rotate-12" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-600 mb-3">
        Ready to Create?
      </h3>
      <p className="text-slate-500 max-w-md leading-relaxed mb-6">
        Your creative journey starts here! Use our AI tools to generate amazing content and watch your dashboard come to life.
      </p>
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span>Track your progress</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span>View analytics</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Track your creative journey and manage your AI-generated content
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Creations"
              value={creations.length}
              icon={Sparkles}
              gradient="from-blue-500 to-purple-600"
              trend={creations.length > 0 ? "All time" : null}
              description="Your creative collection"
            />
            
            <StatCard
              title="Active Plan"
              value={
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              }
              icon={GemIcon}
              gradient="from-orange-500 to-yellow-500"
              description="Current subscription"
            />

            <StatCard
              title="This Week"
              value={recentCreations}
              icon={Calendar}
              gradient="from-green-500 to-teal-500"
              trend={recentCreations > 0 ? `${recentCreations} new` : "No new creations"}
              description="Recent activity"
            />

            <StatCard
              title="Productivity"
              value={creations.length > 0 ? "Active" : "Getting Started"}
              icon={Activity}
              gradient="from-pink-500 to-rose-500"
              description="Creative status"
            />
          </div>

          {/* Recent Creations Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                    Recent Creations
                  </h2>
                  <p className="text-slate-600">
                    {creations.length > 0 
                      ? `Manage and view your ${creations.length} creation${creations.length !== 1 ? 's' : ''}`
                      : "Your creations will appear here once you start generating content"
                    }
                  </p>
                </div>
                {creations.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span>{creations.length} total item{creations.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {loading ? (
                <LoadingSpinner />
              ) : creations.length > 0 ? (
                <div className="space-y-4">
                  {creations.map((item) => (
                    <div 
                      key={item.id} 
                      className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md rounded-lg"
                    >
                      <CreationItem item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Additional Info Cards */}
          {!loading && creations.length > 0 && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Quick Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average per week</span>
                    <span className="font-semibold text-slate-800">
                      {Math.ceil(creations.length / 4)} creations
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Most productive day</span>
                    <span className="font-semibold text-slate-800">Today</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Keep Creating!
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  You're doing great! Continue exploring our AI tools to expand your creative collection and unlock new possibilities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;