import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-3xl font-bold">결제 실패</h2>
        <p className="text-gray-600">
          {message ? message : "결제 진행 중 문제가 발생했습니다."}
        </p>
        <p className="text-sm text-gray-400">에러 코드: {code}</p>
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => navigate("/cart")}>
            장바구니로 돌아가기
          </Button>
          <Button onClick={() => navigate("/")} className="bg-black">
            메인으로
          </Button>
        </div>
      </div>
    </div>
  );
}
