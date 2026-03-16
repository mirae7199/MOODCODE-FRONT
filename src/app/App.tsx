import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { WishlistPage } from "./pages/WishlistPage";
import { LoginPage } from "./pages/LoginPage";
import { OrderPage } from "./pages/OrderPage";
import { SearchPage } from "./pages/SearchPage";
import { ProfilePage } from "./pages/ProfilePage";
import { BrandWishlistPage } from "./pages/BrandWishlistPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { PaymentFailPage } from "./pages/PaymentFailPage";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { BrandWishlistProvider } from "./contexts/BrandWishlistContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { Toaster } from "./components/ui/sonner";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-white">
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/product/:id" element={<RequireAuth><ProductDetailPage /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><WishlistPage /></RequireAuth>} />
        <Route path="/brand-wishlist" element={<RequireAuth><BrandWishlistPage /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/order" element={<RequireAuth><OrderPage /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/payment/success" element={<RequireAuth><PaymentSuccessPage /></RequireAuth>} />
        <Route path="/payment/fail" element={<RequireAuth><PaymentFailPage /></RequireAuth>} />
      </Routes>
      {!isLoginPage && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <BrandWishlistProvider>
              <AppRoutes />
            </BrandWishlistProvider>
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;