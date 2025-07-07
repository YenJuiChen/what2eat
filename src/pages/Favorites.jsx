
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Restaurant, UserHistory } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react"; // Removed MoreVertical
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
// Removed DropdownMenu imports as they are no longer used
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import RestaurantCard from "../components/restaurant/RestaurantCard";

export default function Favorites() {
  const navigate = useNavigate();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteRecords, setFavoriteRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const [favoriteRecords, allRestaurants, deletedRecords] = await Promise.all([
        UserHistory.filter({ 
          created_by: currentUser.email, 
          actionType: 'favorited' 
        }, '-created_date'),
        Restaurant.list(),
        UserHistory.filter({ 
          created_by: currentUser.email, 
          actionType: 'deleted' 
        })
      ]);
      
      // 建立已刪除記錄的 Set
      const deletedIds = new Set(deletedRecords.map(record => record.targetRecordId));
      
      // 過濾掉已刪除的收藏記錄
      const activeFavoriteRecords = favoriteRecords.filter(record => 
        !deletedIds.has(record.id)
      );
      
      // 獲取收藏的餐廳 ID 列表
      const favoriteRestaurantIds = activeFavoriteRecords.map(record => record.restaurantId);
      
      // 過濾出收藏的餐廳
      const favorites = allRestaurants.filter(restaurant => 
        favoriteRestaurantIds.includes(restaurant.id)
      );
      
      setFavoriteRestaurants(favorites);
      setFavoriteRecords(activeFavoriteRecords);
    } catch (error) {
      console.error("載入收藏失敗:", error);
    }
    setIsLoading(false);
  };

  const handleRestaurantClick = (restaurant) => {
    navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`));
  };

  const handleDeleteFavorite = async (restaurant) => {
    try {
      // 找出所有該餐廳的收藏記錄並標記為刪除
      const recordsToDelete = favoriteRecords.filter(record => 
        record.restaurantId === restaurant.id
      );
      
      for (const record of recordsToDelete) {
        await UserHistory.create({
          restaurantId: restaurant.id,
          actionType: "deleted",
          timestamp: new Date().toISOString(),
          targetRecordId: record.id
        });
      }
      
      // 從本地狀態移除
      setFavoriteRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
      setFavoriteRecords(prev => prev.filter(r => r.restaurantId !== restaurant.id));
      
      setDeleteDialogOpen(false);
      setRestaurantToDelete(null);
    } catch (error) {
      console.error("刪除收藏失敗:", error);
    }
  };

  const confirmDelete = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            請先登入查看收藏
          </h3>
          <Button
            onClick={() => User.login()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            立即登入
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入收藏...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">我的收藏</h1>
          </div>
          <p className="text-gray-600">您收藏的精選餐廳</p>
        </div>

        {/* Favorites List */}
        {favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                  showFavoriteIcon={true}
                />
                
                {/* 刪除按鈕 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(restaurant)}
                    className="h-8 w-8 rounded-full bg-white/90 hover:bg-red-100 text-gray-600 hover:text-red-600 shadow-sm transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              還沒有收藏的餐廳
            </h3>
            <p className="text-gray-500 mb-6">
              開始探索美食，收藏您喜愛的餐廳吧！
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              開始尋找美食
            </Button>
          </motion.div>
        )}
      </div>

      {/* 刪除確認對話框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認移除收藏</AlertDialogTitle>
            <AlertDialogDescription>
              您確定要移除「{restaurantToDelete?.name}」的收藏嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restaurantToDelete && handleDeleteFavorite(restaurantToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              確認移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
