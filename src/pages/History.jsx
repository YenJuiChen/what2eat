import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Restaurant } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History as HistoryIcon, 
  Star, 
  MapPin, 
  ExternalLink,
  Clock,
  Utensils 
} from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const restaurants = await Restaurant.list('-selected_date', 10);
      setHistory(restaurants);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getMealColor = (meal) => {
    const colors = {
      'Breakfast': 'bg-amber-100 text-amber-800',
      'Lunch': 'bg-green-100 text-green-800',
      'Afternoon Tea': 'bg-pink-100 text-pink-800',
      'Dinner': 'bg-blue-100 text-blue-800'
    };
    return colors[meal] || 'bg-gray-100 text-gray-800';
  };

  const getPriceLevel = (level) => {
    return '$'.repeat(level || 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <HistoryIcon className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Your Food Journey
              </h1>
            </div>
            <p className="text-teal-100">
              {history.length > 0 
                ? `${history.length} delicious discoveries` 
                : "Your food adventure starts here"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No restaurants yet!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your culinary journey by spinning for your first restaurant recommendation.
            </p>
            <Button
              onClick={() => window.location.href = '/MealPicker'}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-semibold"
            >
              Start Exploring
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                              <Badge className={getMealColor(restaurant.selected_for_meal)}>
                                {restaurant.selected_for_meal}
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

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{restaurant.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {format(new Date(restaurant.selected_date), 'PPP')}
                            </span>
                          </div>
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
        )}
      </div>
    </div>
  );
}