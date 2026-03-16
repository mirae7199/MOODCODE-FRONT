import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { brands } from "../data/products";
import { useBrandWishlist } from "../contexts/BrandWishlistContext";
import { toast } from "sonner";

export function BrandSection() {
  const { toggleBrandWishlist, isInBrandWishlist } = useBrandWishlist();

  const handleToggleBrand = (
    e: React.MouseEvent,
    brand: { id: number; name: string; nameEn: string; logo: string; description: string }
  ) => {
    e.stopPropagation();
    toggleBrandWishlist(brand);
    if (isInBrandWishlist(brand.id)) {
      toast.success("브랜드 관심목록에서 제거되었습니다");
    } else {
      toast.success("브랜드 관심목록에 추가되었습니다");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">인기 브랜드</h2>
            <p className="text-gray-600">트렌디한 브랜드를 만나보세요</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => handleToggleBrand(e, brand)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInBrandWishlist(brand.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="p-4">
                <p className="font-semibold mb-1">{brand.name}</p>
                <p className="text-sm text-gray-600">{brand.nameEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
