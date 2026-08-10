import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart, Users, Image, Sparkles, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const { user } = useUser();
  const { getToken } = useAuth();

  // Fetch published creations
  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setCreations(data.creations || []);
      else {
        toast.error(data.message || "Failed to fetch creations");
        setCreations([]);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setCreations([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like/unlike
  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCreations(); // refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleImageLoad = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageStart = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-96 text-center p-8">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 
                    rounded-3xl flex items-center justify-center transform rotate-12">
        <Image className="w-12 h-12 text-slate-400 transform -rotate-12" />
      </div>
      <h3 className="text-xl font-semibold text-slate-600 mb-3">
        No Creations Yet
      </h3>
      <p className="text-slate-500 max-w-md leading-relaxed">
        The community gallery is waiting for amazing creations! Be the first to share your AI-generated masterpiece.
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
        <Users className="w-4 h-4" />
        <span>Join the creative community</span>
      </div>
    </div>
  );

  return !loading ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="flex flex-1 h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Community Gallery
              </h1>
              <p className="text-slate-600 mt-1">
                Discover and appreciate amazing AI creations from our community
              </p>
            </div>
          </div>
          
          {Array.isArray(creations) && creations.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{creations.length} creation{creations.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Community favorites</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm h-full w-full rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            {Array.isArray(creations) && creations.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {creations.map((creation, index) => {
                  const likes = Array.isArray(creation.likes)
                    ? creation.likes
                    : (creation.likes || "").split(",").filter(Boolean);

                  const isLiked = likes.includes(user?.id);

                  return (
                    <div
                      key={index}
                      className="relative group break-inside-avoid mb-4 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        {imageLoading[index] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={creation.content || "/placeholder.png"}
                          alt="AI Creation"
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                          onLoadStart={() => handleImageStart(index)}
                          onLoad={() => handleImageLoad(index)}
                          onError={() => handleImageLoad(index)}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-end justify-between gap-3">
                              {/* Prompt Text */}
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm leading-relaxed line-clamp-3 break-words">
                                  "{creation.prompt}"
                                </p>
                              </div>
                              
                              {/* Like Button */}
                              <div className="flex-shrink-0">
                                <button
                                  onClick={() => imageLikeToggle(creation.id)}
                                  className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-200 hover:bg-white/30 hover:scale-105 active:scale-95"
                                >
                                  <span className="text-white font-medium text-sm">
                                    {likes.length}
                                  </span>
                                  <Heart
                                    className={`w-5 h-5 transition-all duration-200 ${
                                      isLiked
                                        ? "fill-red-500 text-red-500 scale-110"
                                        : "text-white hover:text-red-300"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Like Indicator */}
                        <div className="absolute top-3 right-3">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            likes.length > 0 
                              ? "bg-white/90 backdrop-blur-sm text-slate-700 shadow-md" 
                              : "bg-white/20 backdrop-blur-sm text-white/80"
                          }`}>
                            <Heart className={`w-3 h-3 ${likes.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                            <span>{likes.length}</span>
                          </div>
                        </div>

                        {/* Liked by current user indicator */}
                        {isLiked && (
                          <div className="absolute top-3 left-3">
                            <div className="px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-white" />
                              <span>Liked</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-slate-600 mt-4 font-medium">Loading community creations...</p>
      </div>
    </div>
  );
};

export default Community;