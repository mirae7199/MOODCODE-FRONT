import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";

interface ProductCardProps {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
}

export function ProductCard({ 
  id,
  image, 
  brand, 
  name, 
  price, 
  originalPrice, 
  discount,
  isNew 
}: ProductCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({ id, image, brand, name, price, originalPrice, discount });
  };

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleWishlistClick}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(id) ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-black text-white">NEW</Badge>
        )}
        {discount && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
            {discount}%
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{brand}</p>
        <p className="text-sm line-clamp-2">{name}</p>
        <div className="flex items-center gap-2">
          {discount && (
            <span className="text-red-600">{discount}%</span>
          )}
          <span className="font-semibold">{formatPrice(price)}원</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
}