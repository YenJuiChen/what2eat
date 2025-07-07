
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Restaurant, UserHistory } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Share2,
  Heart,
  Shuffle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RestaurantDetail() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadRestaurant();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("用戶未登入");
    }
  };

  const loadRestaurant = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const restaurantId = urlParams.get('id');

      if (restaurantId) {
        const restaurants = await Restaurant.list();
        const foundRestaurant = restaurants.find(r => r.id === restaurantId);
        setRestaurant(foundRestaurant);
      }
    } catch (error) {
      console.error("載入餐廳失敗:", error);
    }
    setIsLoading(false);
  };

  const handleFavorite = async () => {
    if (!user || !restaurant) return;

    try {
      await UserHistory.create({
        restaurantId: restaurant.id,
        actionType: "favorited",
        timestamp: new Date().toISOString()
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("收藏失敗:", error);
    }
  };

  const handleShare = async () => {
    if (!restaurant) return;

    const shareText = `我在「今天要吃甚麼」發現了一間好餐廳：${restaurant.name}！\n地址：${restaurant.address}\n#今天要吃甚麼`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log("分享取消");
      }
    } else {
      // 備用方案：複製到剪貼簿
      navigator.clipboard.writeText(shareText);
      alert("已複製分享內容到剪貼簿");
    }
  };

  const handleNavigation = () => {
    if (!restaurant) return;

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = () => {
    if (!restaurant?.phone) return;
    window.location.href = `tel:${restaurant.phone}`;
  };

  const handleRandomAgain = () => {
    navigate(-1); // 返回上一頁並觸發重新抽選
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入餐廳資訊...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            找不到餐廳資訊
          </h3>
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            返回首頁
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Favorite Button */}
        {user && (
          <Button
            variant="ghost"
            onClick={handleFavorite}
            className={`absolute top-4 right-4 z-10 rounded-full w-10 h-10 ${
              isFavorited
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white/80 hover:bg-white text-gray-700"
            }`}
          >
            <Heart className="w-5 h-5" />
          </Button>
        )}

        {/* Restaurant Image */}
        <div className="h-64 bg-gradient-to-br from-orange-400 to-red-400 relative overflow-hidden">
          <img
            src={restaurant.photoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-morphism border-orange-200 shadow-xl -mt-8 relative z-10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-lg font-semibold text-gray-700">
                        {restaurant.rating}
                      </span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      {restaurant.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="flex-1">{restaurant.address}</span>
                  <span className="text-sm text-gray-500">
                    {restaurant.distance}m
                  </span>
                </div>

                {/* Phone */}
                {restaurant.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-orange-500" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}

                {/* Opening Hours */}
                {restaurant.openingHours && restaurant.openingHours.length > 0 && (
                  <div className="flex items-start text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-orange-500 mt-0.5" />
                    <div>
                      {restaurant.openingHours.map((hours, index) => (
                        <div key={index} className="text-sm">
                          {hours}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <Button
            onClick={handleNavigation}
            className="bg-blue-500 hover:bg-blue-600 text-white h-14 flex items-center justify-center"
          >
            <Navigation className="w-5 h-5 mr-2" />
            導航
          </Button>

          {restaurant.phone && (
            <Button
              onClick={handleCall}
              className="bg-green-500 hover:bg-green-600 text-white h-14 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              撥打電話
            </Button>
          )}

          <Button
            onClick={handleShare}
            className="bg-purple-500 hover:bg-purple-600 text-white h-14 flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享
          </Button>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Button
            onClick={handleRandomAgain}
            variant="outline"
            className="w-full h-14 border-orange-300 hover:bg-orange-50 text-orange-600"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            再次抽選
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
