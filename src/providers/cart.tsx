import { createContext, useContext, useEffect, useReducer } from "react";
import { Product } from "@/services/products/product.types";
import { type CartItem } from "@/services/carts/cart.types";
import { getCart, updateCart } from "@/services/carts/cart.service";

interface CartState {
  items?: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: Product["id"] }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: Product["id"]; quantity: number };
    }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.items === undefined) return state;

      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const newItems = [
        ...state.items,
        { product: action.payload, quantity: 1 },
      ];
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    case "REMOVE_ITEM": {
      if (state.items === undefined) return state;

      const newItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    case "UPDATE_QUANTITY": {
      if (state.items === undefined) return state;

      const newItems = state.items.map((item) =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    case "LOAD_CART": {
      return {
        items: action.payload,
        total: calculateTotal(action.payload),
      };
    }
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: Product["id"]) => void;
  updateQuantity: (productId: Product["id"], quantity: number) => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: undefined,
    total: 0,
  });

  useEffect(() => {
    getCart().then((items) => {
      dispatch({ type: "LOAD_CART", payload: items });
    });
  }, []);

  useEffect(() => {
    if (!state.items) return;

    updateCart(state.items);
  }, [state.items]);

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (productId: Product["id"]) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: Product["id"], quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart must be used within a CartProvider");

  return context;
};
