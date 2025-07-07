
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, History, Utensils } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <style>
        {`
          :root {
            --primary-coral: #FF6B6B;
            --primary-teal: #4ECDC4;
            --secondary-purple: #A8E6CF;
            --secondary-orange: #FFD93D;
          }
          
          .meal-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .meal-button:hover {
            transform: translateY(-2px);
          }
          
          .meal-button:active {
            transform: translateY(0px) scale(0.98);
          }
          
          .spin-animation {
            animation: spin 3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
          
          .restaurant-card {
            transition: all 0.3s ease;
          }
          
          .restaurant-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
        `}
      </style>
      
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 z-50">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <Link 
              to={createPageUrl("MealPicker")}
              className={`flex flex-col items-center py-2 px-4 rounded-full transition-all duration-300 ${
                isActive("MealPicker") 
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Utensils className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            
            <Link 
              to={createPageUrl("History")}
              className={`flex flex-col items-center py-2 px-4 rounded-full transition-all duration-300 ${
                isActive("History") 
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <History className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">History</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
