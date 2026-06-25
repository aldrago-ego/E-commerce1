import { create } from "zustand";

// Structure d'un article dans le panier (Ajout de la propriété stock)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  quantity: number;
  stock: number; // <--- Crucial pour les vérifications côté client
}

interface CartState {
  items: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  incrementQuantity: (id: number, size: string) => void;
  decrementQuantity: (id: number, size: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Ajouter un vêtement au panier
  addToCart: (product, size) => {
    set((state) => {
      // On cherche si l'article existe déjà AVEC la même taille
      const existingItem = state.items.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        // Sécurité : On vérifie si la quantité future dépasse le stock disponible
        if (existingItem.quantity >= product.stock) {
          alert(`Désolé, impossible d'ajouter plus d'articles. Stock maximal atteint (${product.stock}).`);
          return { items: state.items };
        }

        // Si oui, on augmente juste sa quantité
        return {
          items: state.items.map((item) =>
            item.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // Si non, on l'ajoute comme nouvel article en incluant son stock initial
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            size: size,
            quantity: 1,
            stock: product.stock, // <--- On stocke le stock renvoyé par le backend
          },
        ],
      };
    });
  },

  // Retirer un article
  removeFromCart: (id, size) => {
    set((state) => ({
      items: state.items.filter((item) => !(item.id === id && item.size === size)),
    }));
  },

  // 1. Augmenter la quantité (+1)
  incrementQuantity: (id, size) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  },

  // 2. Diminuer la quantité (-1) et supprimer si elle atteint 0
  decrementQuantity: (id, size) => {
    set((state) => {
      const targetItem = state.items.find((item) => item.id === id && item.size === size);
      
      if (targetItem && targetItem.quantity > 1) {
        return {
          items: state.items.map((item) =>
            item.id === id && item.size === size
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
      
      // Si la quantité passe en dessous de 1, on supprime l'article du panier
      return {
        items: state.items.filter((item) => !(item.id === id && item.size === size)),
      };
    });
  },

  clearCart: () => set({ items: [] }),
  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));