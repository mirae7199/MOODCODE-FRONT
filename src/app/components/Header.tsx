import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Badge } from "./ui/badge";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { wishlist } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        첫 구매 시 무료배송 + 5% 할인
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 
              className="text-2xl tracking-tight cursor-pointer"
              onClick={() => navigate("/")}
            >
              MUSINSA
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="hover:text-gray-600 transition-colors">랭킹</a>
            <a href="#" className="hover:text-gray-600 transition-colors">신상품</a>
            <a href="#" className="hover:text-gray-600 transition-colors">브랜드</a>
            <a href="#" className="hover:text-gray-600 transition-colors">남성</a>
            <a href="#" className="hover:text-gray-600 transition-colors">여성</a>
            <a href="#" className="hover:text-gray-600 transition-colors">세일</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input 
                type="text" 
                placeholder="상품, 브랜드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => navigate("/search")}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {wishlist.length}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {getItemCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-black text-white text-xs">
                  {getItemCount()}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2">
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">랭킹</a>
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">신상품</a>
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">브랜드</a>
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">남성</a>
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">여성</a>
            <a href="#" className="block py-2 hover:text-gray-600 transition-colors">세일</a>
          </nav>
        )}
      </div>
    </header>
  );
}