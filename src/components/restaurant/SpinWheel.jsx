import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function SpinWheel({ restaurants }) {
  const getCuisineColor = (cuisine) => {
    const colors = {
      'Fast Food': 'bg-red-100 text-red-800',
      'Chinese': 'bg-yellow-100 text-yellow-800',
      'Japanese': 'bg-pink-100 text-pink-800',
      'Italian': 'bg-green-100 text-green-800',
      'Mexican': 'bg-orange-100 text-orange-800',
      'Thai': 'bg-purple-100 text-purple-800',
      'Indian': 'bg-amber-100 text-amber-800',
      'American': 'bg-blue-100 text-blue-800',
      'Café & Dessert': 'bg-rose-100 text-rose-800',
      'Western': 'bg-gray-100 text-gray-800',
      'Korean': 'bg-teal-100 text-teal-800',
      'Vietnamese': 'bg-lime-100 text-lime-800',
      'Mediterranean': 'bg-cyan-100 text-cyan-800'
    };
    return colors[cuisine] || 'bg-gray-100 text-gray-800';
  };

  // Show random restaurants cycling through
  const displayRestaurants = restaurants.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center py-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎰 Spinning for your perfect match...
        </h2>
        <p className="text-gray-600">
          Finding the ideal restaurant just for you!
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {displayRestaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.place_id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: [0, 1, 0], 
              x: [50, 0, -50],
              scale: [0.8, 1, 0.8] 
            }}
            transition={{ 
              duration: 1, 
              delay: index * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={restaurant.photo_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCuisineColor(restaurant.cuisine_type)} size="sm">
                        {restaurant.cuisine_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="mt-8"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">🎯</span>
        </div>
      </motion.div>
    </motion.div>
  );
}