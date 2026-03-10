export type Produit = {
  id: string;
  nom: string;
  prix: number;
  image?: string;
};

export type ArticlePanier = Produit & {
  quantite: number;
};

export type CartState = {
  articles: ArticlePanier[];
  total: number;
};

export type CartAction =
  | { type: 'AJOUTER_ARTICLE'; payload: Produit }
  | { type: 'RETIRER_ARTICLE'; payload: { id: string } }
  | { type: 'MODIFIER_QUANTITE'; payload: { id: string; quantite: number } }
  | { type: 'VIDER_PANIER' };

export const cartInitialState: CartState = {
  articles: [],
  total: 0,
};
