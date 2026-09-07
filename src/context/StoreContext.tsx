"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SelectedVehicle {
  make: string;
  model: string;
  year: string;
  engine?: string;
}

export interface CartItem {
  id: number;
  product: any;
  quantity: number;
}

export interface StoreSettingsData {
  id: number;
  storeNameAr: string;
  storeNameEn: string;
  sloganAr: string;
  sloganEn: string;
  announcementBarText: string;
  announcementEnabled: boolean;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  currency: string;
  logoUrl: string;
  footerAboutAr: string;
  taxNumber: string;
}

interface StoreContextType {
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: SelectedVehicle | null) => void;
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  storeSettings: StoreSettingsData | null;
  refreshSettings: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedVehicle = localStorage.getItem("carparts_vehicle");
      if (savedVehicle) setSelectedVehicleState(JSON.parse(savedVehicle));

      const savedCart = localStorage.getItem("carparts_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("carparts_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Error loading localStorage:", e);
    }

    refreshSettings();
  }, []);

  const refreshSettings = async () => {
    try {
      const res = await fetch("/api/store-settings");
      const data = await res.json();
      if (data.success && data.data) {
        setStoreSettings(data.data);
      }
    } catch (e) {
      console.error("Failed to load store settings", e);
    }
  };

  const setSelectedVehicle = (vehicle: SelectedVehicle | null) => {
    setSelectedVehicleState(vehicle);
    if (vehicle) {
      localStorage.setItem("carparts_vehicle", JSON.stringify(vehicle));
    } else {
      localStorage.removeItem("carparts_vehicle");
    }
  };

  const addToCart = (product: any, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { id: product.id, product, quantity }];
      }
      localStorage.setItem("carparts_cart", JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      localStorage.setItem("carparts_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("carparts_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("carparts_cart");
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("carparts_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.salePrice || item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        selectedVehicle,
        setSelectedVehicle,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        storeSettings,
        refreshSettings,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
