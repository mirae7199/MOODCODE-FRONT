import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, X } from "lucide-react";
import { Product } from "../data/products";
import { ProductCard } from "../components/ProductCard";

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "데님",
    "후드",
    "스니커즈",
  ]);

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

  // 검색 결과 필터링
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setSearchParams({ q: query });

    // 최근 검색어에 추가
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== query);
      return [query, ...filtered].slice(0, 5);
    });
  };

  const handleRemoveRecentSearch = (query: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== query));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="상품, 브랜드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
              className="pl-12 pr-12 h-14 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div>
            <h2 className="text-2xl mb-6">
              검색 결과 ({searchResults.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              '{searchQuery}'에 대한 검색 결과가 없습니다
            </p>
            <p className="text-gray-500">
              다른 검색어를 입력하거나 철자를 확인해주세요
            </p>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">최근 검색어</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-gray-500"
              >
                전체 삭제
              </Button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => handleSearch(query)}
                    className="flex-1 text-left"
                  >
                    <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                    {query}
                  </button>
                  <button
                    onClick={() => handleRemoveRecentSearch(query)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Keywords */}
        {!searchQuery && (
          <div className="max-w-2xl mx-auto mt-12">
            <h2 className="text-xl mb-4">인기 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "후드",
                "데님",
                "패딩",
                "스니커즈",
                "맨투맨",
                "코트",
                "가방",
                "셔츠",
              ].map((keyword, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSearch(keyword)}
                  className="rounded-full"
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
