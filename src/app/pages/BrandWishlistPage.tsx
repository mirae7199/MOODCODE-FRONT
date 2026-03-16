import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { useBrandWishlist } from "../contexts/BrandWishlistContext";
import { toast } from "sonner";

export function BrandWishlistPage() {
  const navigate = useNavigate();
  const { brandWishlist, toggleBrandWishlist } = useBrandWishlist();

  const handleToggleBrand = (brand: any) => {
    toggleBrandWishlist(brand);
    if (brandWishlist.find((b) => b.id === brand.id)) {
      toast.success("브랜드 관심목록에서 제거되었습니다");
    } else {
      toast.success("브랜드 관심목록에 추가되었습니다");
    }
  };

  if (brandWishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl mb-8">브랜드 관심목록</h1>
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-8">
              관심 브랜드가 없습니다
            </p>
            <Button onClick={() => navigate("/")}>브랜드 둘러보기</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-8">
          브랜드 관심목록 ({brandWishlist.length})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brandWishlist.map((brand) => (
            <div key={brand.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleToggleBrand(brand)}
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{brand.name}</p>
                <p className="text-sm text-gray-600">{brand.nameEn}</p>
                <p className="text-sm text-gray-500">{brand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
