import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink } from "lucide-react";

export default function RestaurantList({ restaurants }) {
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

  const getPriceLevel = (level) => {
    return '$'.repeat(level || 1);
  };

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No restaurants match your filters
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters to see more options
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Available Restaurants ({restaurants.length})
      </h2>
      
      <div className="grid gap-4">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.place_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="restaurant-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Restaurant Image */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={restaurant.photo_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop';
                      }}
                    />
                  </div>

                  {/* Restaurant Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCuisineColor(restaurant.cuisine_type)}>
                            {restaurant.cuisine_type}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            {getPriceLevel(restaurant.price_level)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{restaurant.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({restaurant.review_count})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{restaurant.address}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(restaurant.google_maps_url, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}