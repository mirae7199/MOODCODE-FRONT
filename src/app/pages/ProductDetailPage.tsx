import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Minus, Plus, Truck, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Product } from "../data/products";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        const p = data.product; // Backend returns ProductDetailWrapperResponse
        if (p) {
          setProduct({
            id: p.productId,
            image: p.thumbnailImageUrl || "https://images.unsplash.com/photo-1685464583257-66f61ea61380?w=600",
            name: p.productName,
            brand: p.category,
            price: p.originalPrice,
            description: p.productName + " 상품입니다.", // 임시 설명
            options: p.options || [], // { productOptionId, optionName, stock }
            details: p.options?.map((opt: any) => `${opt.optionName} / 재고: ${opt.stock}`) || [],
          });
          if (p.options && p.options.length > 0) {
            setSelectedOption(p.options[0]);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 로딩 중 처리
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 상품이 없을 경우 처리
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl mb-4">상품을 찾을 수 없습니다</h1>
            <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedOption) {
      toast.error("옵션을 선택해주세요");
      return;
    }
    // TODO: 백엔드 API 연동 시 productOptionId를 함께 전달해야 함
    addToCart({
      id: product.id,
      productOptionId: selectedOption.productOptionId,
      image: product.image,
      brand: product.brand,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      size: selectedOption.optionName,
    }, quantity);
    toast.success("장바구니에 추가되었습니다");
  };

  const handleBuyNow = () => {
    if (!selectedOption) {
      toast.error("옵션을 선택해주세요");
      return;
    }
    navigate("/order", {
      state: {
        items: [
          {
            id: product.id,
            productOptionId: selectedOption.productOptionId,
            image: product.image,
            brand: product.brand,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            size: selectedOption.optionName,
            quantity: quantity,
          },
        ],
      },
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (isInWishlist(product.id)) {
      toast.success("위시리스트에서 제거되었습니다");
    } else {
      toast.success("위시리스트에 추가되었습니다");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                {product.discount && (
                  <span className="text-2xl text-red-600">{product.discount}%</span>
                )}
                <span className="text-3xl">{formatPrice(product.price)}원</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}원
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Size Selection */}
            <div>
              <h3 className="mb-3">옵션 선택</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.options?.map((opt: any) => (
                  <button
                    key={opt.productOptionId}
                    onClick={() => setSelectedOption(opt)}
                    disabled={opt.stock <= 0}
                    className={`py-3 border rounded-lg transition-colors ${
                      opt.stock <= 0
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : selectedOption?.productOptionId === opt.productOptionId
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {opt.optionName} {opt.stock <= 0 && "(품절)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="mb-3">수량</h3>
              <div className="flex items-center gap-2 w-32">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="flex-1 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
              </div>
              <Button
                className="w-full bg-black hover:bg-gray-800"
                onClick={handleBuyNow}
              >
                바로 구매
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm">무료배송</p>
                  <p className="text-xs text-gray-500">50,000원 이상 구매 시</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm">반품/교환 가능</p>
                  <p className="text-xs text-gray-500">
                    수령 후 7일 이내 (단순 변심)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">상품 정보</TabsTrigger>
              <TabsTrigger value="review">리뷰 (127)</TabsTrigger>
              <TabsTrigger value="qna">Q&A (8)</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-8">
              <div className="space-y-6">
                {product.description && (
                  <div>
                    <h3 className="text-xl mb-4">상품 설명</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                {product.details && product.details.length > 0 && (
                  <div>
                    <h3 className="text-xl mb-4">상품 상세</h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, index) => (
                        <li key={index} className="text-gray-600">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="review" className="mt-8">
              <p className="text-gray-600">리뷰가 아직 없습니다.</p>
            </TabsContent>
            <TabsContent value="qna" className="mt-8">
              <p className="text-gray-600">문의사항이 아직 없습니다.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}