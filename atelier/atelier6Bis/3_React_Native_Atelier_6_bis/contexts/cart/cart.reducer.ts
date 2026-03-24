import { CartState, CartAction, CartItem } from "./cart.types";

export const cartInitialState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
        //on compare le produit à ajouter avec les produits déjà présents dans le panier
        const existingCartItemIndex = state.items.findIndex((item) => item.product.id === action.payload.id);

        if (existingCartItemIndex !== -1) {
            return  {
                items: state.items.map((item, index) => {
                    if (index === existingCartItemIndex) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                })
            };
        }

        return { items: [...state.items, {product: action.payload, quantity: 1}]};
    }

    case "REMOVE_ITEM": {
        // on cherche le produit à retirer dans le panier
        const existingCartItemIndex = state.items.findIndex((item) => item.product.id === action.payload);

        // le produit n'est pas dans le panier, rien à faire
        if (existingCartItemIndex === -1) return state;

        // si la quantité est > 1, on décrémente
        if (state.items[existingCartItemIndex].quantity > 1) {
            return {
                items: state.items.map((item, index) => {
                    if (index === existingCartItemIndex) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
            };
        }

        // sinon on supprime l'entrée du tableau
        return { items: state.items.filter((item) => item.product.id !== action.payload) };
    }

    case "CLEAR_CART":
        // on vide entièrement le panier
        return { items: [] };

    default:
        return state;
  }
}
