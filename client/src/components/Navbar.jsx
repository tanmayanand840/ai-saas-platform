import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-50 w-full flex justify-between items-center py-4 px-4 sm:px-20 xl:px-32 
      bg-gradient-to-r from-white/95 via-gray-50/90 to-white/95 backdrop-blur-xl shadow-lg border-b border-white/20 transition-all duration-300">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-orange-50/15 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      
      {/* Subtle animated background elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-brandBlue/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-r from-brandOrange/4 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Enhanced Logo Section */}
      <div className="relative group cursor-pointer" onClick={() => navigate("/")}>
        {/* Logo glow effect */}
        <div className="absolute -inset-3 bg-gradient-to-r from-brandBlue/20 via-brandOrange/15 to-brandYellow/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-100/30 to-orange-100/20 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        
        <img
          src={assets.logo}
          alt="logo"
          className="relative w-32 sm:w-44 drop-shadow-lg hover:scale-105 hover:rotate-1 transition-all duration-300 hover:drop-shadow-xl"
        />
        
        {/* Logo reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating brand dots */}
        <div className="absolute -right-2 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-brandBlue rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-brandOrange rounded-full animate-pulse delay-200"></div>
            <div className="w-1.5 h-1.5 bg-brandYellow rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>

      {/* Enhanced User Section */}
      <div className="relative">
        {user ? (
          <div className="relative group">
            {/* UserButton enhancement wrapper */}
            <div className="relative p-2 rounded-full bg-gradient-to-r from-white/80 to-gray-50/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/30">
              {/* Glow effect around user button */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brandBlue/30 via-brandOrange/20 to-brandYellow/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <UserButton />
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="relative group">
            {/* Enhanced Get Started Button */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow rounded-full blur opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brandBlue/60 via-brandOrange/60 to-brandYellow/60 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
            
            <button
              onClick={openSignIn}
              className="relative flex items-center gap-3 rounded-full text-sm font-semibold cursor-pointer 
              bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow text-white 
              px-8 py-3 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Get Started</span>
                <div className="relative">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  {/* Arrow glow */}
                  <ArrowRight className="absolute inset-0 w-4 h-4 opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300" />
                </div>
              </span>
              
              {/* Button shine effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Pulsing accent dot */}
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-pulse"></div>
              </div>
            </button>
            
            {/* Button floating particles */}
            <div className="absolute -top-2 -right-2 w-1 h-1 bg-brandYellow/60 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-brandBlue/50 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
          </div>
        )}
      </div>

      {/* Navbar bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brandOrange/30 to-transparent"></div>
      
      {/* Floating ambient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-2 left-1/3 w-1 h-1 bg-brandBlue/20 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        <div className="absolute top-4 right-1/3 w-0.5 h-0.5 bg-brandOrange/30 rounded-full animate-ping" style={{animationDelay: '4s', animationDuration: '3s'}}></div>
        <div className="absolute bottom-2 left-1/4 w-1 h-1 bg-brandYellow/25 rounded-full animate-ping" style={{animationDelay: '6s', animationDuration: '5s'}}></div>
      </div>

      {/* Dynamic border glow */}
      <div className="absolute inset-0 rounded-none bg-gradient-to-r from-brandBlue/5 via-transparent to-brandOrange/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default Navbar;