import { Scissors, Sparkles, Upload, Download, Share2, Image as ImageIcon, Zap, CheckCircle, AlertCircle, Target } from 'lucide-react';
import React, { useState, useRef } from 'react';
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [originalPreview, setOriginalPreview] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();
    
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setImageLoaded(false);

      if (object.split(' ').length > 1) {
        setLoading(false);
        return toast('Please enter only one object name');
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
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

  const handleFileChange = (file) => {
    if (file) {
      setInput(file);
      // Create preview URL for original image
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreview(previewUrl);
      setContent(""); // Reset processed image
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileChange(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const downloadImage = async () => {
    if (!content) return;
    
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `object-removed-${Date.now()}.png`;
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

  // Disable button if loading, no image, or no object
  const isDisabled = loading || !input || !object.trim();
  const wordCount = object.trim().split(/\s+/).filter(Boolean).length;
  const isMultipleWords = wordCount > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#0066FF] to-[#FF8000] rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] bg-clip-text text-transparent">
                AI Object Remover
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Remove specific objects from your images with precision using advanced AI technology
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
                    Remove Specific Objects
                  </h2>
                </div>

                {/* File Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Upload Image
                  </label>
                  
                  {/* Drag and Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                      dragActive 
                        ? "border-[#FF8000] bg-orange-50 scale-105" 
                        : "border-slate-300 hover:border-[#FFD033] hover:bg-slate-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      required
                    />
                    
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        dragActive 
                          ? "bg-[#FF8000] text-white scale-110" 
                          : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500"
                      }`}>
                        <Upload className="w-8 h-8" />
                      </div>
                      
                      <div>
                        <p className="text-lg font-medium text-slate-700 mb-1">
                          {dragActive ? "Drop your image here" : "Drop image here or click to browse"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports JPG, PNG, WebP and other formats
                        </p>
                      </div>
                    </div>

                    {input && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>File Selected</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  {input && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {input.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(input.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Object Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Object to Remove
                  </label>
                  <div className="relative">
                    <textarea
                      onChange={(e) => setObject(e.target.value)}
                      value={object}
                      rows={4}
                      className="w-full p-4 pr-12 text-sm rounded-xl border-2 border-slate-200 
                               focus:ring-4 focus:ring-[#FFD033]/20 focus:border-[#FFD033] 
                               transition-all duration-200 bg-white/50 backdrop-blur-sm
                               placeholder:text-slate-400 resize-none"
                      placeholder="e.g., watch, spoon, car, person (single object only)"
                      required
                    />
                    <Target className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                  </div>
                  
                  {/* Object validation feedback */}
                  <div className="mt-2 flex items-start gap-2">
                    {object.trim() && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                        isMultipleWords 
                          ? "bg-red-50 text-red-700 border border-red-200" 
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                        {isMultipleWords ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        <span>
                          {isMultipleWords 
                            ? `${wordCount} words detected - please use only one object name`
                            : "Single object name - ready to process"
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700">
                        <p className="font-medium mb-1">Tips for best results:</p>
                        <ul className="space-y-1 text-blue-600">
                          <li>• Use simple, single-word descriptions</li>
                          <li>• Be specific: "car" instead of "vehicle"</li>
                          <li>• Avoid multiple objects in one request</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Button */}
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full flex justify-center items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${
                    isDisabled
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] text-white cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></div>
                      <span>Removing Object...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-5 h-5" />
                      <span>Remove Object</span>
                    </>
                  )}
                </button>

                {/* Processing Info */}
                {loading && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">AI Processing</p>
                        <p className="text-xs text-purple-600">
                          Identifying and removing "{object}" from your image...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column - Results */}
            <div className="w-full xl:flex-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 
                            min-h-[400px] lg:min-h-[600px] transition-all duration-300 
                            hover:shadow-2xl hover:bg-white/90 flex flex-col">
                
                {/* Results Header */}
                <div className="p-6 lg:p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-[#FFD033] to-[#6A5ACD] rounded-lg">
                        <Scissors className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-slate-700">
                        {content ? "Object Removed" : "Processing Result"}
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

                {/* Results Content */}
                <div className="flex-1 p-6 lg:p-8">
                  {!content && !originalPreview ? (
                    <div className="h-full flex justify-center items-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#0066FF] to-[#FF8000] 
                                      rounded-2xl flex items-center justify-center transform rotate-12">
                          <Scissors className="w-10 h-10 text-white transform -rotate-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          Ready to Remove Objects?
                        </h3>
                        <p className="text-slate-500 max-w-md">
                          Upload an image, specify the object to remove, and let our AI do the rest
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Before/After or Single Image Display */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Original Image */}
                        {originalPreview && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              Original
                            </h4>
                            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shadow-inner h-64 lg:h-full">
                              <img
                                src={originalPreview}
                                alt="Original"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {/* Processed Image */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Scissors className="w-4 h-4" />
                            {content ? "Object Removed" : "Processing..."}
                          </h4>
                          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shadow-inner h-64 lg:h-full">
                            {loading && (
                              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="text-center">
                                  <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-transparent animate-spin mx-auto mb-4"></div>
                                  <p className="text-slate-600 font-medium">Removing "{object}"...</p>
                                </div>
                              </div>
                            )}
                            
                            {!imageLoaded && content && (
                              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></div>
                              </div>
                            )}
                            
                            {content && (
                              <img
                                src={content}
                                alt="Object Removed"
                                className={`w-full h-full object-contain transition-opacity duration-500 ${
                                  imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => {
                                  setImageLoaded(true);
                                  toast.error("Failed to load processed image");
                                }}
                              />
                            )}
                            
                            {!content && !loading && originalPreview && (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-slate-500 text-center">
                                  Click "Remove Object" to process your image
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Processing Status */}
                      {content && imageLoaded && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">
                                Successfully removed "{object}" from your image!
                              </p>
                              <p className="text-xs text-green-600">
                                Your processed image is ready for download or sharing
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

export default RemoveObject;