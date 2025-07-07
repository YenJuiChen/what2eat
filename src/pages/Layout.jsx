
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, History, Heart, Settings } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: "首頁", path: createPageUrl("Home"), icon: Home },
    { name: "歷史", path: createPageUrl("History"), icon: History },
    { name: "收藏", path: createPageUrl("Favorites"), icon: Heart },
    { name: "設定", path: createPageUrl("Settings"), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <style>
        {`
          :root {
            --primary-color: #FF9100;
            --primary-light: #FFE0B2;
            --background: #FFF8E1;
          }
          
          .glass-morphism {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -12px rgba(255, 145, 0, 0.3);
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
      
      <div className="pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-orange-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-orange-100"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
