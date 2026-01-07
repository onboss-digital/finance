"use client"

import { useEffect, useState } from "react"

interface WelcomeLoaderProps {
  userName?: string
  onComplete?: () => void
}

export default function WelcomeLoader({ userName = "Usuário", onComplete }: WelcomeLoaderProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Dar tempo para a animação de saída completar
      const exitTimer = setTimeout(() => {
        onComplete?.()
      }, 600)
      return () => clearTimeout(exitTimer)
    }, 3000) // Mostrar por 3 segundos

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center z-50 transition-opacity duration-600 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUpFade {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(16, 185, 129, 0.2); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.6), 0 0 60px rgba(16, 185, 129, 0.4); 
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes floatUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes dotPulse {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(0.8); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes gradientShift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .loader-container {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .logo-wrapper {
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .logo-border {
          animation: rotateBorder 3s linear infinite;
        }
        
        .glow-effect {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        .message-main {
          animation: slideUpFade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          opacity: 0;
        }
        
        .message-sub {
          animation: slideUpFade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards;
          opacity: 0;
        }
        
        .message-loading {
          animation: slideUpFade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s forwards;
          opacity: 0;
        }
        
        .dot-loader {
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        
        .dot-loader:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot-loader:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .bg-glow-1 {
          animation: glowPulse 3s ease-in-out infinite;
        }
        
        .bg-glow-2 {
          animation: glowPulse 3s ease-in-out infinite 1s;
        }
      `}</style>

      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl bg-glow-1"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl bg-glow-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Content */}
      <div className="loader-container relative z-10 flex flex-col items-center justify-center max-w-md">
        {/* Logo with animated border */}
        <div className="logo-wrapper mb-10 relative">
          {/* Outer rotating border */}
          <div className="absolute inset-0 logo-border">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 bg-size-200 opacity-0"></div>
          </div>

          {/* Main logo box with glow */}
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500/80 to-emerald-500/80 flex items-center justify-center glow-effect shadow-2xl border border-cyan-400/30 backdrop-blur-sm">
            <div className="text-white text-5xl font-bold tracking-tighter">OF</div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br"></div>
        </div>

        {/* Loading animation */}
        <div className="flex gap-2 mb-12">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full dot-loader shadow-lg shadow-cyan-500/50"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full dot-loader shadow-lg shadow-emerald-500/50"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full dot-loader shadow-lg shadow-cyan-500/50"></div>
        </div>

        {/* Welcome message */}
        <div className="text-center space-y-4">
          <div className="message-main">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Bem-vindo!
            </h2>
          </div>

          <div className="message-sub">
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 font-semibold">
              {userName}
            </p>
          </div>

          <div className="message-loading">
            <p className="text-sm text-gray-400 italic font-light tracking-wide">
              Preparando sua experiência...
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="message-loading mt-10 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ animation: "shimmer 2s infinite" }}></div>
        </div>
      </div>
    </div>
  )
}
