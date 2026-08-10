import {
  FileText,
  Sparkles,
  Upload,
  Download,
  Share2,
  CheckCircle,
  Zap,
  Star,
  TrendingUp,
  AlertCircle,
  Award,
} from "lucide-react";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Support multiple env var names and a sensible default during local dev
axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please upload your PDF first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const token = await getToken();
      console.log("Auth token:", token ? "✅ Present" : "❌ Missing");

      const { data } = await axios.post(
        `${axios.defaults.baseURL}/api/ai/resume-review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Resume analyzed successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      if (file.type === "application/pdf") {
        setInput(file);
        setContent(""); // Reset analysis
      } else {
        toast.error("Please upload a PDF file");
      }
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
      handleFileChange(file);
    }
  };

  const downloadAnalysis = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-analysis-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Analysis downloaded successfully!");
  };

  const shareAnalysis = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Analysis copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy analysis");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#0066FF] to-[#FF8000] rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] bg-clip-text text-transparent">
                AI Resume Reviewer
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Get professional feedback and improvement suggestions for your
              resume using advanced AI analysis
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-6 lg:gap-8">
            {/* Left Column - Upload Form */}
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
                    Upload Your Resume
                  </h2>
                </div>

                {/* File Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Resume File (PDF Only)
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
                      accept="application/pdf"
                      className="hidden"
                      required
                    />

                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          dragActive
                            ? "bg-[#FF8000] text-white scale-110"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500"
                        }`}
                      >
                        <Upload className="w-8 h-8" />
                      </div>

                      <div>
                        <p className="text-lg font-medium text-slate-700 mb-1">
                          {dragActive
                            ? "Drop your PDF here"
                            : "Drop PDF here or click to browse"}
                        </p>
                        <p className="text-sm text-slate-500">
                          PDF format only • Max 10MB
                        </p>
                      </div>
                    </div>

                    {input && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>PDF Selected</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  {input && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {input.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(input.size / 1024 / 1024).toFixed(2)} MB • PDF
                            Document
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features Info */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          What you'll get:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Comprehensive content analysis</li>
                          <li>• Formatting and structure feedback</li>
                          <li>• ATS compatibility assessment</li>
                          <li>• Improvement recommendations</li>
                          <li>• Professional tips and best practices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  type="submit"
                  disabled={loading || !input}
                  className={`w-full flex justify-center items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${
                    loading || !input
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] text-white cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></div>
                      <span>Analyzing Resume...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Review Resume</span>
                    </>
                  )}
                </button>

                {/* Processing Info */}
                {loading && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          AI Analysis in Progress
                        </p>
                        <p className="text-xs text-purple-600">
                          Reviewing content, structure, and formatting...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column - Analysis Results */}
            <div className="w-full xl:flex-1">
              <div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 
                            min-h-[400px] lg:min-h-[600px] transition-all duration-300 
                            hover:shadow-2xl hover:bg-white/90 flex flex-col"
              >
                {/* Results Header */}
                <div className="p-6 lg:p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-[#FFD033] to-[#6A5ACD] rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-slate-700">
                        {content ? "Analysis Results" : "Resume Analysis"}
                      </h2>
                    </div>

                    {content && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={shareAnalysis}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
                                   text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 
                                   rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={downloadAnalysis}
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
                  {!content ? (
                    <div className="h-full flex justify-center items-center">
                      <div className="text-center">
                        <div
                          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#0066FF] to-[#FF8000] 
                                      rounded-2xl flex items-center justify-center transform rotate-12"
                        >
                          <FileText className="w-10 h-10 text-white transform -rotate-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          Ready for Professional Review?
                        </h3>
                        <p className="text-slate-500 max-w-md leading-relaxed mb-4">
                          Upload your PDF resume and get comprehensive
                          AI-powered analysis with actionable feedback
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Improvement tips</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span>ATS optimization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="prose prose-slate max-w-none">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border-l-4 border-[#FF8000] shadow-inner">
                          <div className="text-slate-700 leading-relaxed">
                            <Markdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-[#FF8000]" />
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-xl font-semibold text-slate-700 mb-3 mt-6 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-blue-600" />
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-lg font-semibold text-slate-600 mb-2 mt-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-4 text-slate-600 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="space-y-2 mb-4 ml-4">
                                    {children}
                                  </ul>
                                ),
                                li: ({ children }) => (
                                  <li className="flex items-start gap-2 text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-[#FF8000] rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{children}</span>
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-slate-800">
                                    {children}
                                  </strong>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg mb-4 italic text-blue-800">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {content}
                            </Markdown>
                          </div>
                        </div>

                        {/* Analysis Complete Badge */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">
                                Analysis Complete!
                              </p>
                              <p className="text-xs text-green-600">
                                Review the feedback above and implement the
                                suggested improvements for better results
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default ReviewResume;
