import { useAuth } from "@clerk/clerk-react";
import { Edit, Hash, Sparkles, Copy, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const token = await getToken();
      // console.log("🔑 Token:", token ? "Present" : "Missing");

      const { data } = await axios.post(
        `${axios.defaults.baseURL}/api/ai/generate-blog-title`,
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("🛰️ Response from backend:", data);

      if (data.success) {
        setContent(data.content);
        toast.success("Titles generated successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Error generating titles:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Titles copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#0066FF] to-[#FF8000] rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0066FF] via-[#FF8000] to-[#6A5ACD] bg-clip-text text-transparent">
                AI Blog Title Generator
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Transform your ideas into compelling blog titles with the power of
              AI
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
                    Create Your Title
                  </h2>
                </div>

                {/* Keyword Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Keyword or Topic
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
                      placeholder="e.g., The future of artificial intelligence..."
                      required
                    />
                    <Edit className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
                    {blogCategories.map((item) => (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(item)}
                        className={`text-xs font-medium px-4 py-3 border-2 rounded-xl cursor-pointer 
                                 transition-all duration-300 transform hover:scale-105 ${
                                   selectedCategory === item
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
                      <span>Generating Amazing Titles...</span>
                    </>
                  ) : (
                    <>
                      <Hash className="w-5 h-5" />
                      <span>Generate Titles</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Results */}
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
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-slate-700">
                        Generated Titles
                      </h2>
                    </div>

                    {content && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                                 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 
                                 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
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
                          <Hash className="w-10 h-10 text-white transform -rotate-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          Ready to Create Amazing Titles?
                        </h3>
                        <p className="text-slate-500 max-w-md">
                          Enter your keyword and select a category to generate
                          compelling blog titles powered by AI
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="prose prose-slate max-w-none">
                        <div
                          className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 
                                      border-l-4 border-[#FF8000] shadow-inner"
                        >
                          <div className="text-slate-700 leading-relaxed">
                            <Markdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-xl font-bold text-slate-800 mb-3">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-lg font-semibold text-slate-700 mb-2">
                                    {children}
                                  </h2>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-3 text-slate-600">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="space-y-2 mb-4">{children}</ul>
                                ),
                                li: ({ children }) => (
                                  <li className="flex items-start gap-2 text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-[#FF8000] rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{children}</span>
                                  </li>
                                ),
                              }}
                            >
                              {content}
                            </Markdown>
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

export default BlogTitles;
