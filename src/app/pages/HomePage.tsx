import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { CategorySection } from "../components/CategorySection";
import { ProductCard } from "../components/ProductCard";
import { BrandSection } from "../components/BrandSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Product } from "../data/products";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/v1/products')
      .then(res => res.json())
      .then(data => {
        const mappedProducts = (data.products || []).map((p: any) => ({
          id: p.productId,
          image: p.thumbnailImageUrl || "https://images.unsplash.com/photo-1685464583257-66f61ea61380?w=600",
          name: p.productName,
          brand: p.category,
          price: p.originalPrice,
        }));
        setProducts(mappedProducts);
      })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const categories = [
    { id: 1, name: "아우터", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 2, name: "상의", image: "https://images.unsplash.com/photo-1708317031389-1afe5ccc6f96?w=400" },
    { id: 3, name: "바지", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400" },
    { id: 4, name: "신발", image: "https://images.unsplash.com/photo-1625622176700-e55445383b85?w=400" },
    { id: 5, name: "가방", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=400" },
    { id: 6, name: "액세서리", image: "https://images.unsplash.com/photo-1611923134239-a5d3ec040a79?w=400" },
  ];

  // 상품 데이터 가져오기
  const rankingProducts = products.slice(0, 8);
  const newProducts = products.filter(p => p.isNew);
  const bestProducts = products.slice(0, 4);
  const saleProducts = products.filter(p => p.discount);

  return (
    <>
      <HeroSection 
        imageUrl="https://images.unsplash.com/photo-1601234979142-1fb9d0431bce?w=1920"
        title="2025 신상품 컬렉션"
        subtitle="새로운 스타일을 만나보세요"
      />

      <CategorySection categories={categories} />

      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="ranking" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="ranking">랭킹</TabsTrigger>
            <TabsTrigger value="new">신상품</TabsTrigger>
            <TabsTrigger value="best">베스트</TabsTrigger>
            <TabsTrigger value="sale">세일</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ranking">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {rankingProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="best">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sale">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <BrandSection />

      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">1,000+ 브랜드</h2>
          <p className="text-xl text-gray-300 mb-8">다양한 브랜드를 한 곳에서</p>
          <button className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            브랜드 전체보기
          </button>
        </div>
      </section>
    </>
  );
}