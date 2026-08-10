import React from "react";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Sophia Johnson",
      title: "Head of Marketing, BrightLabs",
      content:
        "Aivana completely transformed how our team creates content. The AI suggestions feel human and save us so much time.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Michael Chen",
      title: "Content Strategist, NovaTech",
      content:
        "The tools are intuitive and powerful. From blogs to visuals, everything is smoother. Definitely a game changer for creators.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "Emily Carter",
      title: "Freelance Writer",
      content:
        "As a solo creator, I can produce professional-level work at scale now. The AI tools give me the edge I needed.",
      rating: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-b from-[#F8FAFF] via-[#FFFDFE] to-[#FDF7FF]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-orange-100/30 to-blue-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-50/20 via-transparent to-blue-50/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Enhanced title section */}
        <div className="relative inline-block">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-brandBlue via-brandOrange to-brandPurple bg-clip-text text-transparent leading-tight tracking-tight">
            Loved by Creators
          </h2>
          {/* Decorative underline */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-brandBlue via-brandOrange to-brandPurple rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-8 leading-relaxed font-medium">
          Don't just take our word for it. See what others are saying about
          <span className="bg-gradient-to-r from-brandBlue to-brandPurple bg-clip-text text-transparent font-semibold"> Aivana</span>.
        </p>
      </div>

      {/* Enhanced testimonials grid */}
      <div className="flex flex-wrap mt-16 justify-center gap-6 relative z-10">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="group relative p-8 max-w-sm rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-gray-900/5 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-brandOrange/30 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.8s ease-out forwards',
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-orange-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-orange-50/30 transition-all duration-500 rounded-3xl"></div>
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brandOrange/10 to-transparent rounded-bl-3xl rounded-tr-3xl group-hover:from-brandOrange/20 transition-all duration-500"></div>

            {/* Enhanced Stars */}
            <div className="relative z-10 flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="transform transition-all duration-300 group-hover:scale-110"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill={i < testimonial.rating ? "url(#gradient)" : "#E5E7EB"}
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-sm"
                  >
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3588F2" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                    </defs>
                    <path d="M10 1.5l2.7 6.6h6.9l-5.5 4.4 2 6.8-6-4-6 4 2-6.8-5.5-4.4h6.9L10 1.5z" />
                  </svg>
                </div>
              ))}
              <div className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                <span className="text-xs font-semibold text-orange-700">{testimonial.rating}/5</span>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="relative z-10">
              <p className="text-gray-700 text-base my-6 leading-relaxed font-medium italic relative">
                <span className="absolute -top-2 -left-2 text-3xl text-brandBlue/20 font-serif">"</span>
                {testimonial.content}
                <span className="absolute -bottom-4 -right-2 text-3xl text-brandBlue/20 font-serif">"</span>
              </p>
              
              {/* Enhanced divider */}
              <div className="relative mb-6">
                <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-r from-brandBlue to-brandPurple"></div>
              </div>
            </div>

            {/* Enhanced User Info */}
            <div className="relative z-10 flex items-center gap-4 group-hover:gap-5 transition-all duration-300">
              <div className="relative">
                <img
                  src={testimonial.image}
                  className="w-14 h-14 object-cover rounded-2xl border-3 border-white shadow-lg shadow-gray-200/50 group-hover:shadow-brandBlue/20 group-hover:border-brandBlue/30 group-hover:scale-105 transition-all duration-300"
                  alt={testimonial.name}
                />
                {/* Verified badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-brandDark text-base group-hover:text-brandBlue transition-colors duration-300">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  {testimonial.title}
                </p>
                {/* Company highlight */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-brandBlue to-brandPurple rounded-full"></div>
                    <span className="text-xs text-brandBlue font-semibold">Verified Customer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-4 right-8 w-1 h-1 bg-brandBlue rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-8 right-4 w-0.5 h-0.5 bg-brandOrange rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-8 left-6 w-1 h-1 bg-brandPurple rounded-full animate-bounce delay-500"></div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonial;