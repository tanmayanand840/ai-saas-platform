import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mt-20 px-4 sm:px-20 xl:px-32 inline-flex flex-col w-full justify-center bg-gradient-to-br from-white via-brandYellow/20 to-white bg-cover bg-no-repeat min-h-screen overflow-hidden">
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 -z-20">
        {/* Primary floating orbs */}
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-gradient-to-r from-brandBlue/20 to-blue-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-gradient-to-r from-brandOrange/15 to-amber-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-brandYellow/25 to-yellow-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-pink-200/15 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-cyan-200/18 to-blue-200/12 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-16 w-4 h-4 bg-gradient-to-r from-brandBlue to-blue-600 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-gradient-to-r from-brandOrange to-orange-600 rounded-full opacity-25 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute bottom-48 left-20 w-5 h-5 bg-gradient-to-r from-brandYellow to-yellow-600 rounded-full opacity-20 animate-bounce" style={{animationDelay: '3s', animationDuration: '5s'}}></div>
        <div className="absolute top-1/3 right-12 w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-12 w-6 h-2 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.4)_1px,transparent_0)]" style={{backgroundSize: '40px 40px'}}></div>

      {/* Enhanced Heading Section */}
      <div className="relative text-center mb-10 group">
        {/* Floating particles around heading */}
        <div className="absolute -top-4 left-1/4 w-2 h-2 bg-brandBlue/40 rounded-full animate-ping"></div>
        <div className="absolute -top-6 right-1/3 w-1.5 h-1.5 bg-brandOrange/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-0 left-1/3 w-1 h-1 bg-brandYellow/60 rounded-full animate-ping delay-1000"></div>
        
        {/* Main heading with enhanced effects */}
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl md:text-7xl 2xl:text-8xl font-bold mx-auto leading-[1.1] mb-2 hover:scale-105 transition-transform duration-500">
            <span className="inline-block hover:rotate-1 transition-transform duration-300">Create</span>{" "}
            <span className="inline-block hover:-rotate-1 transition-transform duration-300 delay-100">amazing</span>{" "}
            <span className="inline-block hover:rotate-1 transition-transform duration-300 delay-200">content</span>
            <br />
            <span className="inline-block hover:-rotate-1 transition-transform duration-300 delay-300">with</span>{" "}
            <span className="relative inline-block group/gradient hover:scale-110 transition-transform duration-300 delay-400">
              <span className="bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow bg-clip-text text-transparent font-extrabold relative z-10">
                AI tools
              </span>
              {/* Glow effect behind gradient text */}
              <div className="absolute inset-0 bg-gradient-to-r from-brandBlue/20 via-brandOrange/20 to-brandYellow/20 blur-2xl opacity-0 group-hover/gradient:opacity-100 transition-opacity duration-500 scale-150"></div>
            </span>
          </h1>
          
          {/* Subtle text shadow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm"></div>
        </div>

        {/* Enhanced description */}
        <div className="relative">
          <p className="mt-8 max-w-xs sm:max-w-lg 2xl:max-w-2xl m-auto text-base sm:text-lg text-gray-700 hover:text-gray-800 transition-all duration-500 leading-relaxed">
            Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow
          </p>
          
          {/* Decorative line under description */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 opacity-60">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brandBlue to-transparent"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-brandBlue to-brandOrange rounded-full animate-pulse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-brandOrange via-brandYellow to-brandOrange"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-brandYellow to-brandBlue rounded-full animate-pulse delay-500"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brandYellow to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Buttons */}
      <div className="flex flex-wrap justify-center gap-6 text-base max-sm:text-sm mb-12">
        {/* Primary CTA Button */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-500"></div>
          <button
            onClick={() => navigate("/ai")}
            className="relative bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow text-white px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start creating now
              <div className="w-2 h-2 bg-white/80 rounded-full group-hover:animate-bounce"></div>
            </span>
            
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Secondary Button */}
        <div className="relative group">
          <button className="relative bg-white/90 backdrop-blur-sm px-12 py-4 rounded-xl border-2 border-gray-200/80 text-brandDark hover:bg-brandYellow/20 hover:border-brandOrange/60 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl overflow-hidden group">
            <span className="relative z-10 flex items-center gap-3">
              Watch demo
              <div className="w-0 h-0.5 bg-brandOrange group-hover:w-4 transition-all duration-300"></div>
            </span>
            
            {/* Subtle background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brandYellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Ultra Enhanced Trusted Users Section */}
      <div className="relative group mx-auto">
        {/* Background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-brandOrange/10 via-brandYellow/15 to-brandOrange/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative flex items-center gap-5 text-gray-700 hover:text-gray-800 transition-colors duration-300 bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          
          {/* Enhanced user group image */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-brandOrange/20 to-brandYellow/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={assets.user_group} 
              alt="" 
              className="relative h-10 hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
            />
          </div>
          
          {/* Enhanced text with animations */}
          <div className="flex items-center gap-2 text-lg font-medium">
            <span>Trusted by</span>
            <div className="relative group/count">
              <span className="text-brandOrange font-bold text-xl bg-gradient-to-r from-brandOrange to-red-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 inline-block">
                10k+
              </span>
              {/* Number glow effect */}
              <div className="absolute inset-0 text-brandOrange font-bold text-xl opacity-0 group-hover/count:opacity-30 blur-sm transition-opacity duration-300">10k+</div>
            </div>
            <span>people</span>
          </div>
          
          {/* Trust indicator dots */}
          <div className="flex space-x-1 ml-3">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
        
        {/* Floating verification badge */}
        <div className="absolute -right-2 -top-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Subtle bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
      
      {/* Additional floating elements for ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-brandBlue/30 rounded-full animate-ping" style={{animationDelay: '6s', animationDuration: '3s'}}></div>
        <div className="absolute bottom-1/3 right-1/5 w-1.5 h-1.5 bg-brandOrange/40 rounded-full animate-ping" style={{animationDelay: '8s', animationDuration: '4s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-0.5 h-0.5 bg-brandYellow/50 rounded-full animate-ping" style={{animationDelay: '10s', animationDuration: '2s'}}></div>
      </div>
    </div>
  );
};

export default Hero;