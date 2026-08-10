import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group relative p-6 w-full max-w-5xl text-sm bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl cursor-pointer hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Prompt + Info */}
          <div className="flex-1 space-y-3">
            <h2 className="font-semibold text-lg text-[#1E1E2E] break-words group-hover:text-[#0066FF] transition-colors duration-300 leading-relaxed">
              {item.prompt}
            </h2>
            <div className="flex items-center space-x-4 text-gray-500">
              <span className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <span className="font-medium">{item.type}</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Enhanced Type Badge */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"
                 style={{
                   background:
                     item.type === "Image"
                       ? "linear-gradient(to right, #0066FF, #6A5ACD)"
                       : item.type === "Article"
                       ? "linear-gradient(to right, #FF8000, #FFD033)"
                       : "linear-gradient(to right, #6A5ACD, #FFD033)",
                 }}>
            </div>
            <button
              className="relative px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              style={{
                background:
                  item.type === "Image"
                    ? "linear-gradient(135deg, #0066FF, #6A5ACD)" // Blue → Purple
                    : item.type === "Article"
                    ? "linear-gradient(135deg, #FF8000, #FFD033)" // Orange → Yellow
                    : "linear-gradient(135deg, #6A5ACD, #FFD033)", // Purple → Yellow fallback
              }}
            >
              <span className="relative z-10">{item.type}</span>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Expansion Indicator */}
        <div className="flex justify-center mt-4">
          <div className={`w-6 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Enhanced Expanded Section */}
        {expanded && (
          <div className="mt-6 w-full animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Separator Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
            
            {item.type.toLowerCase() === "image" ? (
              <div className="flex justify-center">
                <div className="relative group/image">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={item.content}
                    alt="Generated"
                    className="relative w-full max-w-md rounded-xl object-contain shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border border-white/50"
                  />
                  {/* Image overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Content background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl"></div>
                <div className="relative mt-2 text-sm text-slate-700 max-h-80 overflow-y-auto p-6 rounded-xl border border-gray-100/80 backdrop-blur-sm">
                  <div className="reset-tw prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                    <Markdown>{item.content}</Markdown>
                  </div>
                  {/* Content fade effect at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/90 to-transparent pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{
             background: `linear-gradient(135deg, ${
               item.type === "Image"
                 ? "rgba(0, 102, 255, 0.1), rgba(106, 90, 205, 0.1)"
                 : item.type === "Article"
                 ? "rgba(255, 128, 0, 0.1), rgba(255, 208, 51, 0.1)"
                 : "rgba(106, 90, 205, 0.1), rgba(255, 208, 51, 0.1)"
             })`,
           }}>
      </div>
    </div>
  );
};

export default CreationItem;