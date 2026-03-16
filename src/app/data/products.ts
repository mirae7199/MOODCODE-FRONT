export interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  description?: string;
  details?: string[];
}

export interface Brand {
  id: number;
  name: string;
  nameEn: string;
  logo: string;
  description: string;
}

export const brands: Brand[] = [
  {
    id: 1,
    name: "디스이즈네버댓",
    nameEn: "thisisneverthat",
    logo: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300",
    description: "서울 기반의 스트리트 패션 브랜드",
  },
  {
    id: 2,
    name: "무신사 스탠다드",
    nameEn: "MUSINSA STANDARD",
    logo: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    description: "무신사의 베이직 라인",
  },
  {
    id: 3,
    name: "커버낫",
    nameEn: "COVERNAT",
    logo: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300",
    description: "한국 감성의 캐주얼 웨어",
  },
  {
    id: 4,
    name: "컨버스",
    nameEn: "CONVERSE",
    logo: "https://images.unsplash.com/photo-1625622176700-e55445383b85?w=300",
    description: "클래식 스니커즈 브랜드",
  },
  {
    id: 5,
    name: "마르헨제이",
    nameEn: "MARHEN.J",
    logo: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=300",
    description: "미니멀 가죽 가방 브랜드",
  },
  {
    id: 6,
    name: "앤더슨벨",
    nameEn: "ANDERSSON BELL",
    logo: "https://images.unsplash.com/photo-1601234979142-1fb9d0431bce?w=300",
    description: "서울-스톡홀름 기반 브랜드",
  },
  {
    id: 7,
    name: "나이키",
    nameEn: "NIKE",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    description: "글로벌 스포츠 브랜드",
  },
  {
    id: 8,
    name: "젠틀몬스터",
    nameEn: "GENTLE MONSTER",
    logo: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300",
    description: "하이엔드 아이웨어 브랜드",
  },
];

export const products: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1685464583257-66f61ea61380?w=600",
    brand: "디스이즈네버댓",
    name: "오버핏 후드 집업",
    price: 89000,
    originalPrice: 129000,
    discount: 31,
    description: "편안한 오버핏 실루엣의 후드 집업입니다. 부드러운 원단으로 제작되어 착용감이 뛰어나며, 다양한 스타일링이 가능합니다.",
    details: [
      "소재: 면 100%",
      "색상: 블랙",
      "원산지: 한국",
      "세탁방법: 단독 세탁, 30도 이하 온수 사용",
    ],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1708317031389-1afe5ccc6f96?w=600",
    brand: "무신사 스탠다드",
    name: "베이직 크루넥 스웨터",
    price: 39000,
    isNew: true,
    description: "심플하고 깔끔한 디자인의 크루넥 스웨터입니다. 데일리 착용하기 좋으며, 어떤 스타일과도 잘 어울립니다.",
    details: [
      "소재: 면 80%, 폴리에스터 20%",
      "색상: 네이비",
      "원산지: 한국",
      "세탁방법: 드라이클리닝 권장",
    ],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600",
    brand: "커버낫",
    name: "덕다운 패딩 자켓",
    price: 189000,
    originalPrice: 259000,
    discount: 27,
    description: "고급 덕다운 충전재를 사용한 프리미엄 패딩 자켓입니다. 뛰어난 보온성과 가벼운 착용감을 자랑합니다.",
    details: [
      "소재: 겉감 나일론 100%, 충전재 덕다운 90%",
      "색상: 블랙",
      "원산지: 중국",
      "세탁방법: 드라이클리닝만 가능",
    ],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1625622176700-e55445383b85?w=600",
    brand: "컨버스",
    name: "척테일러 올스타 로우",
    price: 69000,
    description: "컨버스의 시그니처 스니커즈입니다. 클래식한 디자인으로 어떤 스타일과도 잘 매치됩니다.",
    details: [
      "소재: 캔버스 100%",
      "색상: 화이트",
      "원산지: 베트남",
      "관리방법: 미지근한 물로 부드럽게 세척",
    ],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600",
    brand: "마르헨제이",
    name: "크로스백 레더",
    price: 159000,
    isNew: true,
    description: "고급 천연 가죽으로 제작된 크로스백입니다. 실용적인 수납공간과 세련된 디자인이 돋보입니다.",
    details: [
      "소재: 천연 가죽 100%",
      "색상: 브라운",
      "원산지: 한국",
      "관리방법: 가죽 전용 크리너 사용",
    ],
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1601234979142-1fb9d0431bce?w=600",
    brand: "앤더슨벨",
    name: "시그니처 로고 셔츠",
    price: 79000,
    originalPrice: 109000,
    discount: 28,
    description: "브랜드의 시그니처 로고가 돋보이는 셔츠입니다. 깔끔한 핏과 고급스러운 소재가 특징입니다.",
    details: [
      "소재: 면 100%",
      "색상: 화이트",
      "원산지: 한국",
      "세탁방법: 미지근한 물로 단독 세탁",
    ],
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600",
    brand: "어반드레스",
    name: "슬림핏 데님 팬츠",
    price: 59000,
    description: "슬림한 핏의 데님 팬츠입니다. 다양한 상의와 매치하기 좋으며, 사계절 착용 가능합니다.",
    details: [
      "소재: 면 98%, 스판덱스 2%",
      "색상: 인디고",
      "원산지: 한국",
      "세탁방법: 찬물에 단독 세탁",
    ],
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600",
    brand: "나이키",
    name: "에어포스 원 화이트",
    price: 129000,
    description: "나이키의 아이코닉한 농구화를 현대적으로 재해석한 스니커즈입니다. 편안한 착용감과 클래식한 디자인이 특징입니다.",
    details: [
      "소재: 천연/인조 가죽",
      "색상: 화이트",
      "원산지: 베트남",
      "관리방법: 부드러운 천으로 닦아주세요",
    ],
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600",
    brand: "젠틀몬스터",
    name: "선글라스 아세테이트",
    price: 299000,
    isNew: true,
    description: "독특한 디자인의 아세테이트 프레임 선글라스입니다. 강렬한 이미지를 연출할 수 있습니다.",
    details: [
      "소재: 아세테이트 프레임",
      "색상: 블랙",
      "원산지: 한국",
      "UV차단: 100%",
    ],
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    brand: "커버낫",
    name: "오버핏 코치 자켓",
    price: 149000,
    isNew: true,
    description: "넉넉한 오버핏 실루엣의 코치 자켓입니다. 봄, 가을 시즌 아우터로 활용하기 좋습니다.",
    details: [
      "소재: 나일론 100%",
      "색상: 카키",
      "원산지: 중국",
      "세탁방법: 드라이클리닝 권장",
    ],
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600",
    brand: "무신사 스탠다드",
    name: "루즈핏 데님 자켓",
    price: 89000,
    isNew: true,
    description: "여유있는 루즈핏의 데님 자켓입니다. 빈티지한 워싱으로 자연스러운 무드를 연출합니다.",
    details: [
      "소재: 면 100%",
      "색상: 라이트 블루",
      "원산지: 한국",
      "세탁방법: 찬물에 단독 세탁",
    ],
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    brand: "스톤아일랜드",
    name: "로고 패치 맨투맨",
    price: 359000,
    isNew: true,
    description: "스톤아일랜드의 시그니처 로고 패치가 돋보이는 맨투맨입니다. 프리미엄 소재로 제작되었습니다.",
    details: [
      "소재: 면 100%",
      "색상: 블랙",
      "원산지: 이탈리아",
      "세탁방법: 드라이클리닝 권장",
    ],
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  // 카테고리별 필터링 로직 (필요시 구현)
  return products;
}