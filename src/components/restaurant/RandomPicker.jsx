import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Star } from "lucide-react";

export default function RandomPicker({ restaurants, onComplete, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (restaurants.length === 0) return;
    
    setIsSpinning(true);
    
    let spinCount = 0;
    const totalSpins = 30; // 總共旋轉次數
    
    const spinInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % restaurants.length);
      spinCount++;
      
      if (spinCount >= totalSpins) {
        clearInterval(spinInterval);
        
        // 隨機選擇最終餐廳
        const finalIndex = Math.floor(Math.random() * restaurants.length);
        setCurrentIndex(finalIndex);
        setSelectedRestaurant(restaurants[finalIndex]);
        setIsSpinning(false);
        setShowFireworks(true);
        
        // 3秒後自動導向詳細頁
        setTimeout(() => {
          onComplete(restaurants[finalIndex]);
        }, 3000);
      }
    }, 100);
    
    return () => clearInterval(spinInterval);
  }, [restaurants, onComplete]);

  const currentRestaurant = restaurants[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      {/* Fireworks Effect */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-md">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 z-10 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Spinning Card */}
        <AnimatePresence mode="wait">
          {currentRestaurant && (
            <motion.div
              key={currentIndex}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Card className="overflow-hidden border-4 border-orange-400 shadow-2xl">
                <div className="relative">
                  <img
                    src={currentRestaurant.photoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                    alt={currentRestaurant.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Slot Machine Effect */}
                  {isSpinning && (
                    <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
                  )}
                </div>
                
                <CardContent className="p-6 text-center">
                  <motion.h2
                    animate={isSpinning ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
                    className="text-2xl font-bold text-gray-800 mb-2"
                  >
                    {currentRestaurant.name}
                  </motion.h2>
                  
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{currentRestaurant.rating}</span>
                    </div>
                    <span className="text-orange-600 font-medium">
                      {currentRestaurant.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {currentRestaurant.address}
                  </p>
                  
                  {selectedRestaurant && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6"
                    >
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-orange-600 font-bold text-lg">
                        就是這間了！
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        3秒後自動跳轉到詳細頁面...
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spinning Indicator */}
        {isSpinning && (
          <div className="text-center mt-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-4xl mb-2"
            >
              🎰
            </motion.div>
            <p className="text-white text-lg font-medium">
              正在為您抽選餐廳...
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}