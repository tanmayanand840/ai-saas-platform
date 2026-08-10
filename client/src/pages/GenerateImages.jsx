import { Image, Sparkles, Download, Share2, Eye, Palette, Wand2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState(ImageStyle[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setImageLoaded(false);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    if (!content) return;
    
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const shareImage = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Image URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy image URL");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#0066FF] to-[#FF8000] rounded-xl">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] bg-clip-text text-transparent">
                AI Image Generator
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Transform your imagination into stunning visuals with the power of AI
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-6 lg:gap-8">
            {/* Left Column - Input Form */}
            <div className="w-full xl:max-w-lg">
              <form
                onSubmit={onSubmitHandler}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl hover:bg-white/90"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-r from-[#FF8000] to-[#FFD033] rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-700">
                    Create Your Image
                  </h2>
                </div>

                {/* Image Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Describe Your Image
                  </label>
                  <div className="relative">
                    <textarea
                      onChange={(e) => setInput(e.target.value)}
                      value={input}
                      rows={4}
                      className="w-full p-4 pr-12 text-sm rounded-xl border-2 border-slate-200 
                               focus:ring-4 focus:ring-[#FFD033]/20 focus:border-[#FFD033] 
                               transition-all duration-200 bg-white/50 backdrop-blur-sm
                               placeholder:text-slate-400 resize-none"
                      placeholder="A majestic dragon flying over a mystical forest at sunset..."
                      required
                    />
                    <Palette className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Art Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ImageStyle.map((item) => (
                      <button
                        type="button"
                        onClick={() => setSelectedStyle(item)}
                        className={`text-xs font-medium px-4 py-3 border-2 rounded-xl cursor-pointer 
                                 transition-all duration-300 transform hover:scale-105 ${
                          selectedStyle === item
                            ? "bg-gradient-to-r from-[#FF8000] to-[#FFD033] text-white border-transparent shadow-lg shadow-orange-200"
                            : "text-slate-600 border-slate-200 bg-white/50 hover:border-[#6A5ACD] hover:text-[#6A5ACD] hover:bg-purple-50"
                        }`}
                        key={item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="relative cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(e) => setPublish(e.target.checked)}
                        checked={publish}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500 transition-all duration-300 shadow-inner"></div>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-sm"></span>
                    </label>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Make this image public</p>
                      <p className="text-xs text-slate-500">Share with the community gallery</p>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center gap-3 
                           bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] 
                           text-white px-6 py-4 text-sm font-semibold rounded-xl 
                           shadow-lg transition-all duration-300 transform
                           ${
                             loading
                               ? "opacity-70 cursor-not-allowed scale-95"
                               : "cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95"
                           }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></div>
                      <span>Creating Your Masterpiece...</span>
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5" />
                      <span>Generate Image</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Generated Image */}
            <div className="w-full xl:flex-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 
                            min-h-[400px] lg:min-h-[600px] transition-all duration-300 
                            hover:shadow-2xl hover:bg-white/90 flex flex-col">
                
                {/* Results Header */}
                <div className="p-6 lg:p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-[#FFD033] to-[#6A5ACD] rounded-lg">
                        <Image className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-slate-700">
                        Generated Image
                      </h2>
                    </div>
                    
                    {content && imageLoaded && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={shareImage}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
                                   text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 
                                   rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={downloadImage}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
                                   text-white bg-gradient-to-r from-blue-500 to-purple-500 
                                   hover:from-blue-600 hover:to-purple-600 rounded-lg 
                                   transition-all duration-200 transform hover:scale-105 shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Content */}
                <div className="flex-1 p-6 lg:p-8">
                  {!content ? (
                    <div className="h-full flex justify-center items-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#0066FF] to-[#FF8000] 
                                      rounded-2xl flex items-center justify-center transform rotate-12">
                          <Image className="w-10 h-10 text-white transform -rotate-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          Ready to Create Art?
                        </h3>
                        <p className="text-slate-500 max-w-md">
                          Describe your vision and select an art style to generate stunning AI-powered images
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="relative flex-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shadow-inner">
                        {loading && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="text-center">
                              <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-transparent animate-spin mx-auto mb-4"></div>
                              <p className="text-slate-600 font-medium">Generating your image...</p>
                              <p className="text-sm text-slate-400">This may take a moment</p>
                            </div>
                          </div>
                        )}
                        
                        {!imageLoaded && content && (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></div>
                          </div>
                        )}
                        
                        <img
                          src={content}
                          alt="AI Generated Image"
                          className={`w-full h-full object-contain transition-opacity duration-500 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => {
                            setImageLoaded(true);
                            toast.error("Failed to load generated image");
                          }}
                        />
                      </div>
                      
                      {imageLoaded && content && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-l-4 border-[#FF8000]">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-[#FF8000] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Generated Image</p>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                Style: <span className="font-medium">{selectedStyle}</span> • 
                                {publish ? " Public" : " Private"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;