export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="mb-4">고객센터</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1544-1234</p>
              <p>평일 09:00 - 18:00</p>
              <p>주말, 공휴일 휴무</p>
            </div>
          </div>

          {/* Shopping Guide */}
          <div>
            <h3 className="mb-4">쇼핑 안내</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">주문/배송</a></li>
              <li><a href="#" className="hover:text-black">교환/반품</a></li>
              <li><a href="#" className="hover:text-black">FAQ</a></li>
              <li><a href="#" className="hover:text-black">1:1 문의</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4">회사 정보</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">회사 소개</a></li>
              <li><a href="#" className="hover:text-black">채용 정보</a></li>
              <li><a href="#" className="hover:text-black">이용 약관</a></li>
              <li><a href="#" className="hover:text-black">개인정보처리방침</a></li>
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h3 className="mb-4">SNS</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">인스타그램</a></li>
              <li><a href="#" className="hover:text-black">페이스북</a></li>
              <li><a href="#" className="hover:text-black">유튜브</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>㈜무신사 | 대표이사: 조만호 | 사업자등록번호: 211-88-79575</p>
          <p className="mt-2">통신판매업신고: 2012-서울강남-01897 | 개인정보보호책임자: 홍길동</p>
          <p className="mt-2">서울특별시 성동구 아차산로 13길 11, 1층</p>
          <p className="mt-4">© 2025 MUSINSA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
