import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";

const categoryColors = {
  "速食": "bg-red-100 text-red-800",
  "中式": "bg-yellow-100 text-yellow-800",
  "日式": "bg-pink-100 text-pink-800",
  "韓式": "bg-purple-100 text-purple-800",
  "異國": "bg-blue-100 text-blue-800",
  "甜點": "bg-green-100 text-green-800",
  "咖啡": "bg-amber-100 text-amber-800",
  "其他": "bg-gray-100 text-gray-800"
};

export default function RestaurantCard({ restaurant, onClick, showFavoriteIcon = false }) {
  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${distance}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="card-hover cursor-pointer overflow-hidden border-orange-200 hover:border-orange-400"
        onClick={onClick}
      >
        <div className="relative">
          <img
            src={restaurant.photoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          {showFavoriteIcon && (
            <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              {restaurant.distance && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatDistance(restaurant.distance)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-lg leading-tight">
              {restaurant.name}
            </h3>
            <Badge className={`${categoryColors[restaurant.category]} text-xs`}>
              {restaurant.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {restaurant.address}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}