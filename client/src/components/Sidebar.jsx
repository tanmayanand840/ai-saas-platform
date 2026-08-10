import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-gradient-to-br from-white via-slate-50 to-gray-50 border-r border-gray-200/50 backdrop-blur-xl flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 shadow-xl shadow-gray-900/5 ${
        sidebar ? "translate-x-0" : "max-sm:translate-x-full"
      } transition-all duration-300 ease-out max-sm:z-50`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
      
      {/* Top Section */}
      <div className="my-7 w-full relative z-10">
        {/* Enhanced User Avatar Section */}
        <div className="relative mx-auto w-fit">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-14 h-14 rounded-2xl mx-auto border-3 border-gradient-to-r from-[#FF8000] to-[#FFD033] shadow-lg shadow-orange-200/50 transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        
        <div className="mt-4 px-4">
          <h1 className="text-center text-base font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent leading-tight">
            {user.fullName}
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#0066FF] to-[#6A5ACD] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Enhanced Nav Links */}
        <div className="px-4 mt-8 space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `group relative px-4 py-3.5 flex items-center gap-3.5 rounded-2xl font-medium text-sm transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-[#0066FF] via-[#0066FF] to-[#6A5ACD] text-white shadow-lg shadow-blue-500/30 scale-[0.98] transform"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 hover:text-[#0066FF] hover:shadow-md hover:shadow-blue-100/50 hover:scale-[1.02] transform backdrop-blur-sm"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Background glow effect for active state */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-white/20 backdrop-blur-sm shadow-inner" 
                      : "group-hover:bg-white/80 group-hover:shadow-sm"
                  }`}>
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? "text-white" : "text-gray-600 group-hover:text-[#0066FF]"
                      }`}
                    />
                  </div>
                  
                  <span className="relative z-10 font-semibold tracking-wide">
                    {label}
                  </span>
                  
                  {/* Subtle hover indicator */}
                  {!isActive && (
                    <div className="absolute right-3 w-1 h-8 bg-gradient-to-b from-[#0066FF] to-[#6A5ACD] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      <div className="w-full border-t border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm relative z-10">
        {/* Decorative border glow */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        
        <div className="p-5 px-6 flex items-center justify-between">
          <div
            onClick={openUserProfile}
            className="flex gap-3 items-center cursor-pointer group transition-all duration-300 hover:bg-white/60 rounded-2xl p-2 -m-2 hover:shadow-md hover:shadow-gray-200/50"
          >
            <div className="relative">
              <img
                src={user.imageUrl}
                alt=""
                className="w-10 h-10 rounded-xl border-2 border-gradient-to-r from-[#FFD033] to-[#FF8000] shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {user.fullName}
              </h1>
              <p className="text-xs flex items-center gap-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300`}>
                  <Protect 
                    plan="premium" 
                    fallback={
                      <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    }
                  >
                    <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  </Protect>
                </span>
                <span className="text-gray-500">Plan</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={signOut}
            className="group relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-200/50 hover:scale-105"
          >
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Sign out
              <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;