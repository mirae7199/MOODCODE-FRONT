import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success("장바구니에 추가되었습니다");
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl mb-8">위시리스트</h1>
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-8">
              위시리스트가 비어있습니다
            </p>
            <Button onClick={() => navigate("/")}>쇼핑 계속하기</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-8">
          위시리스트 ({wishlist.length})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group relative">
              <div
                className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{item.brand}</p>
                <p className="text-sm line-clamp-2">{item.name}</p>
                <div className="flex items-center gap-2">
                  {item.discount && (
                    <span className="text-red-600">{item.discount}%</span>
                  )}
                  <span>{formatPrice(item.price)}원</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(item.originalPrice)}원
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  담기
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast.success("위시리스트에서 제거되었습니다");
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
