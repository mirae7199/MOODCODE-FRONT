import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useUser } from "./UserContext";
import { toast } from "sonner";

export interface CartItem {
  id: number;
  productOptionId?: number; // 백엔드 연동용
  cartItemId?: number; // 백엔드 연동용 (수정, 삭제 시 필요)
  image: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (cartItemId: number, productId?: number) => void;
  updateQuantity: (cartItemId: number, quantity: number, optionName?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useUser();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 로그인 상태에 따라 백엔드 장바구니 데이터 불러오기
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch("/api/v1/carts/items", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const serverCart: CartItem[] = data.findCartItemResponse.map((item: any) => ({
          id: item.productId,
          productOptionId: item.productOptionId,
          cartItemId: item.cartItemId,
          image: item.imageUrl || "https://images.unsplash.com/photo-1685464583257-66f61ea61380?w=600",
          brand: item.brand,
          name: item.productName,
          price: item.price,
          quantity: item.count,
          size: item.optionName,
        }));
        setCart(serverCart);
      }
    } catch (err) {
      console.error("장바구니 조회 실패:", err);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      // 비로그인 상태일 때는 localStorage만 사용
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    if (isAuthenticated && token) {
      if (!item.productOptionId) {
        toast.error("옵션 정보가 없습니다.");
        return;
      }
      try {
        const res = await fetch("/api/v1/carts/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productOptionId: item.productOptionId,
            count: quantity
          })
        });
        if (res.ok) {
          fetchCart(); // 추가 후 장바구니 새로고침
        } else {
          toast.error("장바구니 담기에 실패했습니다.");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // 로컬 장바구니 로직
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id && i.size === item.size);
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prevCart, { ...item, quantity }];
      });
    }
  };

  const removeFromCart = async (cartItemId: number, productId?: number) => {
    if (isAuthenticated && token) {
      try {
        const res = await fetch(`/api/v1/carts/items/${cartItemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          fetchCart();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // 로컬에서는 productId(id)로 삭제
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (idOrCartItemId: number, quantity: number, optionName?: string) => {
    if (quantity <= 0) {
      // 삭제 처리
      if (isAuthenticated) {
        removeFromCart(idOrCartItemId);
      } else {
        removeFromCart(-1, idOrCartItemId); // 로컬 처리
      }
      return;
    }

    if (isAuthenticated && token) {
      if (!optionName) return;
      try {
        const res = await fetch(`/api/v1/carts/items/${idOrCartItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            optionName: optionName,
            count: quantity
          })
        });
        if (res.ok) {
          fetchCart();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === idOrCartItemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    if (!isAuthenticated) localStorage.removeItem("cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
