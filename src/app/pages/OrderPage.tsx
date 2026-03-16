import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Separator } from "../components/ui/separator";
import { useCart, CartItem } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

export function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { addresses, userInfo, token } = useUser();
  const [selectedAddressId, setSelectedAddressId] = useState<number>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || 0
  );
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeAll, setAgreeAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // location.state에서 직접 주문 상품을 가져오거나, 장바구니 전체를 사용
  const orderItems: CartItem[] = location.state?.items || cart;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const totalPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const finalTotal = totalPrice;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleOrder = async () => {
    if (isProcessing) return;

    setIsProcessing(true); // Set to true at the beginning of the process

    if (!selectedAddress) {
      toast.error("배송지를 선택해주세요");
      setIsProcessing(false); // Reset in case of validation error
      return;
    }

    if (!agreeAll) {
      toast.error("주문 동의 항목을 확인해주세요");
      setIsProcessing(false); // Reset in case of validation error
      return;
    }

    // 1. 백엔드에 주문 생성 요청
    let apiUrl = "";
    let requestBody = {};

    const isDirectOrder = orderItems.length === 1 && orderItems[0].cartItemId === undefined;

    if (isDirectOrder) {
      if (!orderItems[0].productOptionId) {
        toast.error("상품 옵션 정보가 올바르지 않습니다.");
        setIsProcessing(false); // Reset in case of validation error
        return;
      }
      apiUrl = "/api/v1/orders/product";
      requestBody = {
        productOptionId: orderItems[0].productOptionId,
        count: orderItems[0].quantity,
        addressId: selectedAddressId,
      };
    } else {
      const cartItemIds = orderItems
        .map((item) => item.cartItemId)
        .filter((id) => id !== undefined);

      if (cartItemIds.length === 0) {
        toast.error("주문할 상품 정보가 올바르지 않습니다.");
        setIsProcessing(false); // Reset in case of validation error
        return;
      }
      apiUrl = "/api/v1/orders/cart";
      requestBody = {
        cartItemIds,
        addressId: selectedAddressId,
      };
    }

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error("주문 생성에 실패했습니다.");
      }

      // 백엔드에서 생성된 orderNo 반환
      const orderNo = await res.text();

      // 2. 토스 페이먼츠 결제 창 호출
      const clientKey = "test_ck_E92LAa5PVbw4AgBe4ObPr7YmpXyJ";
      // @ts-ignore
      const tossPayments = window.TossPayments(clientKey);

      const orderName =
        orderItems.length > 1
          ? `${orderItems[0].name} 외 ${orderItems.length - 1}건`
          : orderItems[0].name;

      // 결제 수단 매핑 (테스트 환경에서는 카드로 통일하거나 일부만 지원)
      const tossMethod =
        paymentMethod === "card"
          ? "카드"
          : paymentMethod === "bank"
          ? "가상계좌"
          : paymentMethod === "mobile"
          ? "휴대폰"
          : "카드";

      await tossPayments.requestPayment(tossMethod, {
        amount: finalTotal,
        orderId: orderNo,
        orderName: orderName,
        customerName: userInfo?.nickname || "고객",
        // 결제 완료 후 이동할 프론트엔드 URL
        successUrl: window.location.origin + "/payment/success",
        failUrl: window.location.origin + "/payment/fail",
      });

    } catch (error) {
      console.error(error);
      toast.error("결제 요청 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-8">
              주문할 상품이 없습니다
            </p>
            <Button onClick={() => navigate("/")}>쇼핑 계속하기</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-8">주문/결제</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl mb-4">주문 상품 ({orderItems.length})</h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="mb-1">{item.name}</p>
                      {item.size && (
                        <p className="text-sm text-gray-600">
                          사이즈: {item.size}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        수량: {item.quantity}개
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송지 정보 */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">배송지 정보</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                >
                  배송지 관리
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6 border rounded-lg bg-gray-50">
                  <p className="text-gray-600 mb-4">등록된 배송지가 없습니다.</p>
                  <Button onClick={() => navigate("/profile")}>
                    배송지 추가하기
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddressId.toString()}
                  onValueChange={(value) => setSelectedAddressId(Number(value))}
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start space-x-2 p-4 border rounded-lg"
                    >
                      <RadioGroupItem
                        value={address.id.toString()}
                        id={`address-${address.id}`}
                      />
                      <Label
                        htmlFor={`address-${address.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {address.recipientName}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                                기본배송지
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            ({address.zipCode}) {address.address}{" "}
                            {address.detailAddress}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* 주문자 정보 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl mb-4">주문자 정보</h2>
              <div className="space-y-4">
                <div>
                  <Label>이름</Label>
                  <Input value={userInfo?.nickname || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label>이메일</Label>
                  <Input value={userInfo?.email || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label>연락처</Label>
                  <Input value={userInfo?.phone || ""} readOnly className="mt-1" />
                </div>
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl mb-4">결제 수단</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    신용카드
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 cursor-pointer">
                    무통장 입금
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                    휴대폰 결제
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="kakao" id="kakao" />
                  <Label htmlFor="kakao" className="flex-1 cursor-pointer">
                    카카오페이
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-4 space-y-4">
              <h2 className="text-xl">결제 정보</h2>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 금액</span>
                  <span>{formatPrice(totalPrice)}원</span>
                </div>

              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>총 결제 금액</span>
                <span className="text-xl font-semibold">
                  {formatPrice(finalTotal)}원
                </span>
              </div>

              <div className="space-y-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={(e) => setAgreeAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    주문 내용을 확인하였으며, 결제에 동의합니다
                  </span>
                </label>
              </div>

              <Button
                className="w-full bg-black hover:bg-gray-800"
                onClick={handleOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "결제 진행 중..." : `${formatPrice(finalTotal)}원 결제하기`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
