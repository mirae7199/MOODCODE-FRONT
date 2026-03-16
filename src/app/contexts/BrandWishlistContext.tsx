import { createContext, useContext, useState, ReactNode } from "react";

export interface Brand {
  id: number;
  name: string;
  nameEn: string;
  logo: string;
  description: string;
}

interface BrandWishlistContextType {
  brandWishlist: Brand[];
  addToBrandWishlist: (brand: Brand) => void;
  removeFromBrandWishlist: (id: number) => void;
  isInBrandWishlist: (id: number) => boolean;
  toggleBrandWishlist: (brand: Brand) => void;
}

const BrandWishlistContext = createContext<BrandWishlistContextType | undefined>(
  undefined
);

export function BrandWishlistProvider({ children }: { children: ReactNode }) {
  const [brandWishlist, setBrandWishlist] = useState<Brand[]>([]);

  const addToBrandWishlist = (brand: Brand) => {
    setBrandWishlist((prev) => {
      if (prev.find((b) => b.id === brand.id)) {
        return prev;
      }
      return [...prev, brand];
    });
  };

  const removeFromBrandWishlist = (id: number) => {
    setBrandWishlist((prev) => prev.filter((brand) => brand.id !== id));
  };

  const isInBrandWishlist = (id: number) => {
    return brandWishlist.some((brand) => brand.id === id);
  };

  const toggleBrandWishlist = (brand: Brand) => {
    if (isInBrandWishlist(brand.id)) {
      removeFromBrandWishlist(brand.id);
    } else {
      addToBrandWishlist(brand);
    }
  };

  return (
    <BrandWishlistContext.Provider
      value={{
        brandWishlist,
        addToBrandWishlist,
        removeFromBrandWishlist,
        isInBrandWishlist,
        toggleBrandWishlist,
      }}
    >
      {children}
    </BrandWishlistContext.Provider>
  );
}

export function useBrandWishlist() {
  const context = useContext(BrandWishlistContext);
  if (!context) {
    throw new Error("useBrandWishlist must be used within BrandWishlistProvider");
  }
  return context;
}
