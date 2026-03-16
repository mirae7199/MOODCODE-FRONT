import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useUser();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const isRequested = useRef(false);

  useEffect(() => {
    if (isRequested.current) return;
    
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      return;
    }

    const confirmPayment = async () => {
      isRequested.current = true;
      try {
        // Backend API doesn't use @RequestBody, so we send it as URLSearchParams or change backend
        // Let's send as form data / query params for safety if backend doesn't have @RequestBody
        const res = await fetch(`/api/v1/payment?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setStatus("success");
          clearCart(); // 결제 성공 시 장바구니 비우기
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    confirmPayment();
  }, [searchParams, token, clearCart]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {status === "loading" && <h2 className="text-2xl font-bold">결제 승인 중...</h2>}
      {status === "success" && (
        <div className="text-center space-y-6">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold">결제가 완료되었습니다!</h2>
          <p className="text-gray-600">주문해주셔서 감사합니다.</p>
          <Button onClick={() => navigate("/")} className="mt-8 bg-black">
            쇼핑 계속하기
          </Button>
        </div>
      )}
      {status === "error" && (
        <div className="text-center space-y-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold">결제 승인 실패</h2>
          <p className="text-gray-600">결제 처리 중 오류가 발생했습니다.</p>
          <Button onClick={() => navigate("/")} className="mt-8">
            메인으로 돌아가기
          </Button>
        </div>
      )}
    </div>
  );
}
