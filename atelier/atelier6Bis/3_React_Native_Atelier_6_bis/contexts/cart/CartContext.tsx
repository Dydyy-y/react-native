import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CartState, CartAction } from "./cart.types";
import { cartReducer, cartInitialState } from "./cart.reducer";
import { Product } from "../../types/products.type";

type CartContextValue = {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const addItem = (product: Product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (productId: number) => dispatch({ type: "REMOVE_ITEM", payload: productId });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
