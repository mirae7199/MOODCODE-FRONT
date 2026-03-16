import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useUser } from "../contexts/UserContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  // 이미 로그인된 상태라면 메인 페이지로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 소셜 로그인 핸들러
  // 백엔드의 OAuth2 로그인 엔드포인트로 리다이렉트합니다.
  const handleSocialLogin = (provider: 'google' | 'kakao' | 'apple') => {
    // Spring Security OAuth2 기본 경로는 /oauth2/authorization/{provider} 입니다.
    // 프론트엔드와 백엔드가 다른 포트를 사용하므로, 백엔드의 절대 주소로 이동시킵니다.
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto mt-20">
          <div className="flex justify-center mb-6">
            {/* 여기에 무신사 로고 이미지를 넣어주세요. 예시: <img src="/images/musinsa_logo.png" alt="무신사 로고" className="h-10" /> */}
            {/* 현재는 플레이스홀더 텍스트로 대체합니다. */}
            <span className="text-4xl font-bold">MOODCODE</span>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">로그인</h1>
          <p className="text-center text-gray-500 mb-10">
            소셜 계정으로 간편하게 시작하세요
          </p>

          <div className="space-y-4">
            {/* 카카오 로그인 */}
            <Button
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD800] text-black border-none text-base"
              onClick={() => handleSocialLogin("kakao")}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="#000000">
                <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.8 6.7-.2.7-.7 2.7-.8 3.1-.1.5.2.5.4.4.3-.1 3.5-2.3 4.1-2.7.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
              </svg>
              카카오로 로그인
            </Button>

            {/* Google 로그인 */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white text-gray-700 text-base border-gray-300 hover:bg-gray-50"
              onClick={() => handleSocialLogin("google")}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 로그인
            </Button>

            {/* Apple 로그인 */}
            <Button
              className="w-full h-12 bg-black hover:bg-gray-800 text-white border-none text-base"
              onClick={() => handleSocialLogin("apple")}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.44c0 0 1.04-.12 1.4.92.36 1.04-.04 2.4-.72 3.24-.68.84-1.8 1.4-2.8 1.28-.16-1.12.52-2.52 1.16-3.32.64-.8 1.96-1.52 2.36-1.48v-.64z"/>
                <path d="M15.485 5.8c-1.6.12-2.8.96-3.52 1.76-.72-.8-2.08-1.68-3.76-1.68-2.2 0-4.04 1.4-4.88 3.56-1.56 3.88.52 9.04 2.8 11.6.84 1.04 1.96 2.08 3.28 2.08 1.24 0 2.2-.84 3.76-.84 1.68 0 2.4.84 3.84.84 1.28 0 2.36-1.04 3.16-2.08 1.28-1.68 1.84-3.8 1.88-4.04-.04-.04-3.16-1.2-3.2-4.88-.04-3.28 2.76-4.92 2.88-5.04-1.6-2.12-3.8-2.36-4.24-2.36z"/>
              </svg>
              Apple로 로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}