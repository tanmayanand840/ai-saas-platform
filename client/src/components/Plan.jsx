import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="relative max-w-4xl mx-auto z-20 my-32 px-4 overflow-hidden">
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Primary floating orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-[#3588F2]/15 to-blue-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-[#F59E0B]/12 to-orange-200/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#9333EA]/18 to-purple-200/12 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-gradient-to-r from-cyan-200/15 to-blue-200/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-r from-rose-200/12 to-pink-200/8 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(53,136,242,0.3)_1px,transparent_0)]" style={{backgroundSize: '30px 30px'}}></div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-12 w-3 h-3 bg-[#3588F2]/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="absolute top-32 right-16 w-2.5 h-2.5 bg-[#F59E0B]/35 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-[#9333EA]/25 rounded-full animate-bounce" style={{animationDelay: '3s', animationDuration: '5s'}}></div>
        <div className="absolute top-1/3 right-8 w-1.5 h-6 bg-gradient-to-b from-[#3588F2]/20 to-[#F59E0B]/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Ultra Enhanced Section Header */}
      <div className="relative text-center mb-16 group">
        {/* Floating particles around header */}
        <div className="absolute -top-4 left-1/4 w-2 h-2 bg-[#3588F2]/40 rounded-full animate-ping"></div>
        <div className="absolute -top-6 right-1/3 w-1.5 h-1.5 bg-[#F59E0B]/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-2 left-1/3 w-1 h-1 bg-[#9333EA]/60 rounded-full animate-ping delay-1000"></div>
        
        {/* Enhanced heading with multiple effects */}
        <div className="relative inline-block mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#3588F2] via-[#F59E0B] to-[#9333EA] bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 leading-tight">
            Choose Your Plan
          </h2>
          
          {/* Multi-layer glow effects behind heading */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#3588F2]/10 via-[#F59E0B]/8 to-[#9333EA]/12 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-100/30 via-orange-100/20 to-purple-100/25 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          {/* Gradient underline */}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#3588F2] via-[#F59E0B] to-[#9333EA] rounded-full opacity-60 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-orange-300 to-purple-300 rounded-full opacity-40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
        </div>

        {/* Enhanced description */}
        <div className="relative">
          <p className="text-lg text-gray-700 hover:text-gray-800 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 mb-6">
            Start for free and scale up as you grow. Find the perfect plan for
            your content creation needs.
          </p>
          
          {/* Decorative elements under description */}
          <div className="flex justify-center items-center space-x-4 opacity-70">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#3588F2] to-transparent"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-[#3588F2] to-[#F59E0B] rounded-full animate-pulse"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#F59E0B] via-[#9333EA] to-[#F59E0B]"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-[#9333EA] to-[#3588F2] rounded-full animate-pulse delay-500"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#9333EA] to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Pricing Table Container */}
      <div className="relative group">
        {/* Container background effects */}
        <div className="absolute -inset-6 bg-gradient-to-r from-[#3588F2]/5 via-[#F59E0B]/8 to-[#9333EA]/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute -inset-4 bg-gradient-to-br from-white/60 via-gray-50/40 to-white/60 rounded-2xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative mt-14 max-sm:mx-8">
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: "#3588F2", // Blue
                colorText: "#1F2937", // Dark gray
                colorTextSecondary: "#6B7280", // Muted gray
                colorBackground: "#FFFFFF", // Card background
                colorInputBackground: "#F9FAFB", // Light input bg
                colorDanger: "#F59E0B", // Orange for alerts
                colorSuccess: "#9333EA", // Purple for success accents
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "500",
              },
              elements: {
                rootBox: "shadow-2xl border-2 border-gray-100/80 hover:shadow-3xl hover:border-[#F59E0B]/30 transition-all duration-500 backdrop-blur-sm bg-white/95 rounded-2xl overflow-hidden",
                planCard: "relative hover:-translate-y-2 hover:scale-105 hover:border-[#F59E0B]/60 duration-500 hover:shadow-2xl transition-all group/card bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm border-2 border-gray-100/60 rounded-xl overflow-hidden",
                planName: "text-xl font-bold bg-gradient-to-r from-[#3588F2] to-[#F59E0B] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300",
                planPrice: "text-3xl font-extrabold bg-gradient-to-r from-[#9333EA] to-[#3588F2] bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 relative",
                planDescription: "text-gray-600 hover:text-gray-700 transition-colors duration-300 leading-relaxed",
                planButton: `
                  relative overflow-hidden bg-gradient-to-r from-[#3588F2] via-[#F59E0B] to-[#9333EA] text-white font-semibold rounded-xl px-8 py-3 
                  hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
                  before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700
                  after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/5 after:via-white/10 after:to-white/5 
                  after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
                `,
                planFeature: "flex items-center space-x-3 text-gray-700 hover:text-gray-800 transition-colors duration-300 group/feature",
                planFeatureIcon: "text-[#9333EA] group-hover/feature:scale-110 transition-transform duration-300",
                planFeatureText: "group-hover/feature:translate-x-1 transition-transform duration-300",
                planHeader: "relative bg-gradient-to-br from-gray-50/80 to-white/90 p-6 border-b border-gray-100/60",
                planBody: "p-6 bg-gradient-to-br from-white to-gray-50/20",
                popularBadge: "absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#9333EA] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse",
              },
            }}
          />
        </div>

        {/* Floating accent elements around pricing table */}
        <div className="absolute -top-4 -left-4 w-3 h-3 bg-[#3588F2]/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
        <div className="absolute -top-2 -right-6 w-2 h-2 bg-[#F59E0B]/40 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
        <div className="absolute -bottom-4 -left-2 w-2.5 h-2.5 bg-[#9333EA]/35 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-700 transition-opacity duration-300"></div>
        <div className="absolute -bottom-2 -right-4 w-2 h-2 bg-gradient-to-r from-[#3588F2] to-[#F59E0B] rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
      </div>

      {/* Bottom decorative elements */}
      <div className="flex justify-center mt-16">
        <div className="flex items-center space-x-6 opacity-60">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-1 h-1 rounded-full bg-gradient-to-r from-[#3588F2] to-[#F59E0B] animate-pulse"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#F59E0B] via-[#9333EA] to-[#3588F2] rounded-full opacity-70"></div>
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-1 h-1 rounded-full bg-gradient-to-r from-[#9333EA] to-[#3588F2] animate-pulse"
                style={{
                  animationDelay: `${(index + 5) * 200}ms`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Final ambient floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-[#3588F2]/20 rounded-full animate-ping" style={{animationDelay: '8s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 bg-[#F59E0B]/25 rounded-full animate-ping" style={{animationDelay: '10s', animationDuration: '3s'}}></div>
        <div className="absolute top-2/3 left-1/5 w-0.5 h-0.5 bg-[#9333EA]/30 rounded-full animate-ping" style={{animationDelay: '12s', animationDuration: '5s'}}></div>
      </div>
    </div>
  );
};

export default Plan;