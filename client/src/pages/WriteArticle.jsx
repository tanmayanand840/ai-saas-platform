import React, { useState, useMemo } from "react";
import {
  Edit,
  Sparkles,
  BookOpen,
  Download,
  Share2,
  Clock,
  FileText,
  TrendingUp,
  Eye,
  Copy,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        `/api/ai/generate-article`,
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
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

  // Calculate word count and reading time
  const articleStats = useMemo(() => {
    if (!content) return { wordCount: 0, readingTime: 0 };

    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute

    return { wordCount, readingTime };
  }, [content]);

  const downloadArticle = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `article-${input
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Article downloaded successfully!");
  };

  const shareArticle = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Article copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy article");
    }
  };

  const getEstimatedTime = () => {
    const baseTime =
      selectedLength.length <= 800 ? 2 : selectedLength.length <= 1200 ? 3 : 5;
    return `${baseTime}-${baseTime + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#0066FF] to-[#FF8000] rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] bg-clip-text text-transparent">
                AI Article Writer
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Generate high-quality, engaging articles on any topic with
              advanced AI writing assistance
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-6 lg:gap-8">
            {/* Left Column - Configuration Form */}
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
                    Article Configuration
                  </h2>
                </div>

                {/* Article Topic */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Article Topic
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setInput(e.target.value)}
                      value={input}
                      type="text"
                      className="w-full p-4 pr-12 text-sm rounded-xl border-2 border-slate-200 
                               focus:ring-4 focus:ring-[#FFD033]/20 focus:border-[#FFD033] 
                               transition-all duration-200 bg-white/50 backdrop-blur-sm
                               placeholder:text-slate-400"
                      placeholder="The future of artificial intelligence, climate change solutions, productivity tips..."
                      required
                    />
                    <Edit className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Be specific for better results. Example: "Benefits of remote
                    work for startups"
                  </p>
                </div>

                {/* Article Length */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Article Length
                  </label>
                  <div className="space-y-3">
                    {articleLength.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedLength(item)}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedLength.text === item.text
                            ? "border-[#FF8000] bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md"
                            : "border-slate-200 bg-white/50 hover:border-[#FFD033] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedLength.text === item.text
                                  ? "border-[#FF8000] bg-[#FF8000]"
                                  : "border-slate-300"
                              }`}
                            >
                              {selectedLength.text === item.text && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {item.text}
                              </p>
                              <p className="text-xs text-slate-500">
                                ~{getEstimatedTime()} min read
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {index === 0
                                ? "Quick"
                                : index === 1
                                ? "Detailed"
                                : "Comprehensive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={`w-full flex justify-center items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${
                    loading || !input.trim()
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] text-white cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></div>
                      <span>Crafting Your Article...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      <span>Generate Article</span>
                    </>
                  )}
                </button>

                {/* Generation Info */}
                {loading && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          AI Writing in Progress
                        </p>
                        <p className="text-xs text-blue-600">
                          Creating a {selectedLength.text.toLowerCase()} article
                          about "{input}"...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips Section */}
                {!loading && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 mb-2">
                          Pro Tips:
                        </p>
                        <ul className="text-xs text-purple-700 space-y-1">
                          <li>• Use specific topics for better results</li>
                          <li>• Consider your target audience</li>
                          <li>• Review and edit generated content</li>
                          <li>• Add your unique perspective</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column - Generated Article */}
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
                        {loading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></div>
                        ) : (
                          <Edit className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-700">
                          {content ? "Generated Article" : "Your Article"}
                        </h2>
                        {content && (
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>{articleStats.wordCount} words</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{articleStats.readingTime} min read</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {content && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={shareArticle}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
                                   text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 
                                   rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </button>
                        <button
                          onClick={downloadArticle}
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

                {/* Article Content */}
                <div className="flex-1 p-6 lg:p-8">
                  {!content ? (
                    <div className="h-full flex justify-center items-center">
                      <div className="text-center">
                        <div
                          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#0066FF] to-[#FF8000] 
                                      rounded-2xl flex items-center justify-center transform rotate-12"
                        >
                          <Edit className="w-10 h-10 text-white transform -rotate-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          Ready to Write?
                        </h3>
                        <p className="text-slate-500 max-w-md leading-relaxed mb-4">
                          Enter your topic and select the desired length to
                          generate a comprehensive article
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>SEO optimized</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Engaging content</span>
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
                                  <h1 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-xl font-semibold text-slate-700 mb-3 mt-6">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-lg font-semibold text-slate-600 mb-2 mt-4">
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
                                ol: ({ children }) => (
                                  <ol className="space-y-2 mb-4 ml-4 list-decimal">
                                    {children}
                                  </ol>
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
                                code: ({ children }) => (
                                  <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {content}
                            </Markdown>
                          </div>
                        </div>

                        {/* Article Complete Badge */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">
                                Article Generated Successfully!
                              </p>
                              <p className="text-xs text-green-600">
                                {articleStats.wordCount} words •{" "}
                                {articleStats.readingTime} minute read • Ready
                                to publish
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

export default WriteArticle;
