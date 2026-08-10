import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-20 w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-gray-600 mt-20 overflow-hidden">
      {/* Complex Background Effects */}
      <div className="absolute inset-0 -z-20">
        {/* Primary floating orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-200/30 to-amber-200/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200/35 to-pink-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Secondary smaller orbs */}
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-r from-green-200/25 to-emerald-200/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-rose-200/30 to-red-200/20 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>
      
      {/* Enhanced grid pattern with animation */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] animate-pulse" style={{backgroundSize: '24px 24px'}}></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full opacity-25 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-15 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute top-1/2 right-10 w-2 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Top Section */}
      <div className="relative flex flex-col md:flex-row justify-between w-full gap-16 border-b border-gradient-to-r border-gray-200/60 pb-16">
        
        {/* Ultra Enhanced Logo + About */}
        <div className="md:max-w-lg group">
          <div className="relative flex items-center gap-5 mb-8">
            <div className="relative group/logo">
              {/* Multi-layer glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-purple-400/25 to-orange-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-300/20 via-blue-300/15 to-cyan-300/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-all duration-500"></div>
              <div className="absolute -inset-2 bg-white/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
              
              <img 
                src={assets.logo} 
                alt="logo" 
                className="relative w-28 h-28 object-contain hover:scale-110 hover:rotate-3 transition-all duration-500 drop-shadow-lg" 
              />
              
              {/* Logo reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent rounded-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Brand name with gradient text */}
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aivana
              </h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase">AI Innovation</p>
            </div>
          </div>
          
          <div className="relative">
            <p className="text-base leading-relaxed text-gray-700 hover:text-gray-800 transition-all duration-500 relative z-10 mb-6">
              Aivana helps creators and businesses craft stunning content with AI — 
              from articles to visuals — faster and smarter than ever before.
            </p>
            
            {/* Quote decoration */}
            <div className="absolute -left-4 top-0 text-6xl text-blue-100 font-serif leading-none opacity-50">"</div>
            <div className="absolute -right-4 bottom-0 text-6xl text-purple-100 font-serif leading-none opacity-50 rotate-180">"</div>
          </div>
          
          {/* Enhanced decorative elements */}
          <div className="flex items-center justify-between mt-8 opacity-70">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse delay-300"></div>
              <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse delay-700"></div>
            </div>
            <div className="text-xs text-gray-400 font-mono">EST. 2025</div>
          </div>
        </div>

        {/* Ultra Enhanced Links Section */}
        <div className="flex-1 flex items-start md:justify-end gap-24">
          
          {/* Ultra Enhanced Quick Links */}
          <div className="group/section">
            <div className="relative mb-8">
              <h2 className="font-bold text-xl text-gray-800 relative inline-block">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover/section:w-full transition-all duration-700 rounded-full"></div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 group-hover/section:w-full transition-all duration-500 delay-200 rounded-full"></div>
              </h2>
              {/* Section icon */}
              <div className="absolute -right-8 top-0 w-6 h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <ul className="text-sm space-y-4">
              {[
                { href: '/', text: 'Home', color: '#3588F2', gradient: 'from-blue-400 to-blue-600' },
                { href: '/about', text: 'About', color: '#F59E0B', gradient: 'from-amber-400 to-orange-500' },
                { href: '/ai', text: 'AI Tools', color: '#9333EA', gradient: 'from-purple-400 to-purple-600' },
                { href: '/pricing', text: 'Pricing', color: '#20C363', gradient: 'from-green-400 to-emerald-500' },
                { href: '/contact', text: 'Contact', color: '#F97316', gradient: 'from-orange-400 to-red-500' }
              ].map((link, index) => (
                <li key={index} className="group/link">
                  <a 
                    href={link.href} 
                    className="relative flex items-center transition-all duration-400 hover:translate-x-2 py-1"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => e.target.style.color = link.color}
                    onMouseLeave={(e) => e.target.style.color = 'inherit'}
                  >
                    <span className={`w-0 h-1 bg-gradient-to-r ${link.gradient} group-hover/link:w-4 mr-0 group-hover/link:mr-3 transition-all duration-400 rounded-full`}></span>
                    <span className="relative">
                      {link.text}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 -skew-x-12"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ultra Enhanced Contact */}
          <div className="group/contact">
            <div className="relative mb-8">
              <h2 className="font-bold text-xl text-gray-800 relative inline-block">
                Get in Touch
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 group-hover/contact:w-full transition-all duration-700 rounded-full"></div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-300 to-red-300 group-hover/contact:w-full transition-all duration-500 delay-200 rounded-full"></div>
              </h2>
              {/* Section icon */}
              <div className="absolute -right-8 top-0 w-6 h-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg opacity-0 group-hover/contact:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>
            </div>
            <div className="text-sm space-y-5 text-gray-700">
              {[
                { icon: 'from-blue-400 to-cyan-500', text: 'Email: support@aivana.com', type: 'email' },
                { icon: 'from-green-400 to-emerald-500', text: 'Phone: +91 98765 43210', type: 'phone' },
                { icon: 'from-purple-400 to-indigo-500', text: 'Bangalore, India', type: 'location' }
              ].map((contact, index) => (
                <div key={index} className="group/item flex items-center gap-4 hover:text-gray-800 transition-all duration-300 hover:translate-x-1">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.icon} animate-pulse`} style={{animationDelay: `${index * 200}ms`}}></div>
                    <div className={`absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r ${contact.icon} opacity-0 group-hover/item:opacity-50 scale-150 transition-all duration-300`}></div>
                  </div>
                  <span className="relative">
                    {contact.text}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 -skew-x-12"></div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Newsletter Section */}
      <div className="relative mt-16 border-b border-gray-200/60 pb-12 text-center">
        {/* Background decoration with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/40 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-orange-50/20"></div>
        </div>
        
        <div className="relative z-10">
          {/* Enhanced heading with multiple effects */}
          <div className="relative inline-block mb-6">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Subscribe to our Newsletter
            </h3>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-200/20 via-purple-200/15 to-orange-200/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating particles around heading */}
            <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping delay-500"></div>
            <div className="absolute -bottom-2 left-1/4 w-0.5 h-0.5 bg-orange-400 rounded-full animate-ping delay-1000"></div>
          </div>
          
          <p className="text-base text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get the latest AI tools, tips, and updates delivered straight to your inbox.
            <br />
            <span className="text-sm text-gray-500 font-medium">Join 10,000+ creators already subscribed</span>
          </p>
          
          {/* Ultra enhanced form */}
          <form className="flex flex-col sm:flex-row justify-center items-center gap-5 max-w-lg mx-auto group">
            <div className="relative w-full sm:flex-1 group/input">
              {/* Multiple background layers */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/15 to-orange-400/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/30 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
              
              <input
                type="email"
                placeholder="Enter your email address"
                className="relative w-full px-6 py-4 rounded-xl border-2 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/60 bg-white/90 backdrop-blur-sm hover:border-gray-300/80 hover:bg-white transition-all duration-400 shadow-lg focus:shadow-xl text-gray-700 placeholder-gray-400"
              />
              
              {/* Input highlight effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <button
              type="submit"
              className="relative px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-400 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden group/button transform hover:-rotate-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Subscribe Now
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </span>
              
              {/* Multiple button effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 rounded-xl blur opacity-0 group-hover/button:opacity-30 transition-opacity duration-300"></div>
            </button>
          </form>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Weekly insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Bottom Section */}
      <div className="relative pt-12 pb-8">
        {/* Animated decorative line */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-full opacity-60"></div>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500 animate-pulse"
                  style={{
                    animationDelay: `${(index + 5) * 200}ms`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced copyright with hover effects */}
        <div className="text-center group/copyright">
          <p className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-500 relative inline-block">
            © {new Date().getFullYear()} Aivana. All Rights Reserved.
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent opacity-0 group-hover/copyright:opacity-100 transition-opacity duration-500 -skew-x-12"></span>
          </p>
          <div className="mt-3 flex justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover/copyright:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
      
      {/* Final floating animation overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/30 rounded-full animate-ping" style={{animationDelay: '3s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-300/40 rounded-full animate-ping" style={{animationDelay: '5s', animationDuration: '3s'}}></div>
        <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-orange-300/35 rounded-full animate-ping" style={{animationDelay: '7s', animationDuration: '5s'}}></div>
      </div>
    </footer>
  );
};

export default Footer;