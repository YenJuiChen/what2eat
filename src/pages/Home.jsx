import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, Coffee, Sunrise, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const foodQuotes = [
  "美食是治癒心靈的最佳良藥",
  "每一餐都是新的冒險",
  "好食物，好心情",
  "生活中最美好的事情都與美食有關",
  "美食不僅填飽肚子，更溫暖心靈",
  "品嚐美食，享受當下",
  "美食是愛的另一種表達方式",
  "每一口都是幸福的味道"
];

const mealTypes = [
  {
    id: "breakfast",
    name: "早餐",
    icon: Sunrise,
    color: "from-yellow-400 to-orange-400",
    description: "美好的一天從早餐開始"
  },
  {
    id: "lunch",
    name: "午餐",
    icon: Sun,
    color: "from-orange-400 to-red-400",
    description: "午後能量補充時間"
  },
  {
    id: "afternoon_tea",
    name: "下午茶",
    icon: Coffee,
    color: "from-amber-400 to-orange-500",
    description: "悠閒的午後時光"
  },
  {
    id: "dinner",
    name: "晚餐",
    icon: Moon,
    color: "from-purple-400 to-blue-500",
    description: "結束一天的美好饗宴"
  }
];

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const randomQuote = foodQuotes[Math.floor(Math.random() * foodQuotes.length)];
    setCurrentQuote(randomQuote);
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleMealTypeSelect = (mealType) => {
    navigate(createPageUrl(`RestaurantList?mealType=${mealType}`));
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <Utensils className="w-24 h-24 text-white mx-auto" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            今天要吃甚麼
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-white/90 italic font-medium"
          >
            {currentQuote}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-orange-500 mr-2" />
            <span className="text-gray-600">正在定位附近餐廳...</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">請選擇餐期</h1>
          <p className="text-gray-600">讓我們為您推薦最棒的美食</p>
        </motion.div>

        {/* Current Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-morphism border-orange-200 shadow-xl">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-700 italic font-medium">
                "{currentQuote}"
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meal Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mealTypes.map((mealType, index) => (
            <motion.div
              key={mealType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className="card-hover cursor-pointer border-2 border-orange-200 hover:border-orange-400 transition-all duration-300"
                onClick={() => handleMealTypeSelect(mealType.id)}
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${mealType.color} h-32 rounded-t-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <mealType.icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {mealType.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {mealType.description}
                    </p>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      開始尋找
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>準備好探索美食世界了嗎？</p>
        </motion.div>
      </div>
    </div>
  );
}