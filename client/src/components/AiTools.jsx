import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brandBlue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brandOrange/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-brandYellow/5 rounded-full blur-3xl"></div>
      </div>

      {/* Section Header */}
      <div className="text-center relative">
        <div className="inline-block">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow bg-clip-text text-transparent mb-2 leading-tight">
            Powerful AI Tools
          </h2>
          <div className="h-1 bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow rounded-full mx-auto w-3/4 opacity-60"></div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto mt-8 text-lg leading-relaxed">
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology
        </p>
      </div>

      {/* Tools Grid */}
      <div className="flex flex-wrap mt-16 justify-center gap-8 lg:gap-10">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="group relative p-10 max-w-sm rounded-[2rem] bg-white/90 backdrop-blur-lg shadow-2xl border border-white/20 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] hover:border-brandOrange/30 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-700 cursor-pointer overflow-hidden"
            onClick={() => user && navigate(tool.path)}
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 50%, rgba(248,250,252,0.9) 100%)'
            }}
          >
            {/* Multi-layered Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-brandBlue/5 via-transparent to-brandOrange/5 opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* Enhanced Animated Border Gradient */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brandBlue via-brandOrange to-brandYellow opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 -z-10 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Enhanced Icon Container */}
              <div className="relative mb-8 group/icon">
                <div className="absolute -inset-3 bg-gradient-to-br from-brandOrange/10 via-brandBlue/10 to-brandYellow/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 group/icon-hover:scale-110 transition-all duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-brandOrange/20 to-brandBlue/20 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                <tool.Icon
                  className="relative w-16 h-16 p-4 text-white rounded-3xl shadow-2xl group-hover:shadow-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 z-10"
                  style={{ 
                    background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)'
                  }}
                />
                {/* Icon reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Enhanced Title & Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-brandDark group-hover:text-brandBlue group-hover:scale-105 transition-all duration-500 origin-left">
                  {tool.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed max-w-[95%] group-hover:text-gray-700 transition-all duration-500">
                  {tool.description}
                </p>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-4 right-6 w-1 h-1 bg-brandBlue rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-4 w-0.5 h-0.5 bg-brandOrange rounded-full animate-pulse delay-150"></div>
                <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-brandYellow rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            
            {/* Enhanced shine effect with multiple layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brandBlue/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out delay-200"></div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Bottom Decoration */}
      <div className="flex justify-center mt-24">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brandBlue to-brandOrange animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brandOrange to-brandYellow animate-pulse delay-300"></div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brandYellow to-brandBlue animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiTools