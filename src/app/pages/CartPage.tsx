import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/CartContext";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState, useEffect } from "react";

export function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const finalTotal = getTotalPrice();

  interface ProductOption {
    productOptionId: number;
    optionName: string;
    stock: number;
  }

  const [productOptions, setProductOptions] = useState<{ [productId: number]: ProductOption[] }>({});

  const fetchProductOptions = async (productId: number) => {
    if (productOptions[productId]) return; // Already fetched

    try {
      const res = await fetch(`/api/v1/products/${productId}/option`);
      if (res.ok) {
        const data = await res.json();
        setProductOptions((prev) => ({
          ...prev,
          [productId]: data.responses,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch product options", error);
    }
  };

  useEffect(() => {
    cart.forEach((item) => {
      fetchProductOptions(item.id);
    });
  }, [cart]);

  const handleOptionChange = (item: CartItem, newOptionName: string) => {
    const selectedOption = productOptions[item.id]?.find(
      (option) => option.optionName === newOptionName
    );

    if (selectedOption && item.cartItemId) {
      updateQuantity(item.cartItemId, item.quantity, newOptionName);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl mb-8">장바구니</h1>
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-8">
              장바구니가 비어있습니다
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
        <h1 className="text-3xl mb-8">장바구니</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <h3 className="mb-1">{item.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-600">사이즈: {item.size}</p>
                    )}
                    {productOptions[item.id] && productOptions[item.id].length > 1 && (
                      <Select
                        value={item.size}
                        onValueChange={(newSize) => handleOptionChange(item, newSize)}
                      >
                        <SelectTrigger className="w-[120px] mt-2">
                          <SelectValue placeholder="옵션 변경" />
                        </SelectTrigger>
                        <SelectContent>
                          {productOptions[item.id].map((option) => (
                            <SelectItem key={option.productOptionId} value={option.optionName}>
                              {option.optionName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.cartItemId || item.id, item.quantity - 1, item.size)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.cartItemId || item.id, item.quantity + 1, item.size)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p>{formatPrice(item.price * item.quantity)}원</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.cartItemId || -1, item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              장바구니 비우기
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4 space-y-4">
              <h2 className="text-xl">주문 요약</h2>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 금액</span>
                  <span>{formatPrice(getTotalPrice())}원</span>
                </div>

              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>총 결제 금액</span>
                <span className="text-xl">{formatPrice(finalTotal)}원</span>
              </div>
              <Button
                className="w-full bg-black hover:bg-gray-800"
                onClick={() => navigate("/order")}
              >
                주문하기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                쇼핑 계속하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}