# Atelier 8 — Architecture des contextes (Étape 1)

## Objectif

Concevoir la structure des contextes qui géreront l'état global de l'application boutique :
- Le **panier** (CartContext) — avec un reducer
- Le **thème** clair/sombre (ThemeContext)
- Les **notifications** temporaires (NotificationContext)

---

## Les fichiers créés

```
context/
├── CartContext.tsx          ← Contexte panier (reducer)
├── ThemeContext.tsx         ← Contexte thème
├── NotificationContext.tsx  ← Contexte notifications
└── CounterContext.tsx       ← Existant (atelier précédent)
```

---

## Pourquoi trois contextes séparés ?

Le principe est d'**isoler** chaque responsabilité dans son propre contexte. Si on mettait tout dans un seul contexte global, n'importe quel composant qui écoute le thème serait re-rendu à chaque ajout au panier. En séparant, seuls les composants qui consomment le contexte modifié se re-rendent.

---

## CartContext — Contexte avec Reducer

### Pourquoi un reducer ici ?

Le panier nécessite plusieurs types d'opérations (ajouter, retirer, modifier la quantité, vider). Un **reducer** est adapté car :
- Il centralise toute la logique de mutation dans une seule fonction
- Chaque action est explicite et facile à déboguer
- L'état reste prévisible et immutable

### L'état (`CartState`)

```ts
type CartState = {
  articles: ArticlePanier[]; // liste des produits dans le panier
  total: number;             // prix total calculé
};
```

### Le type `ArticlePanier`

Un article du panier est un `Produit` enrichi d'une quantité :

```ts
type ArticlePanier = Produit & {
  quantite: number;
};
```

### Les actions (`CartAction`)

| Action | Payload | Description |
|--------|---------|-------------|
| `AJOUTER_ARTICLE` | `Produit` | Ajoute un produit ou incrémente sa quantité si déjà présent |
| `RETIRER_ARTICLE` | `{ id }` | Retire complètement un produit du panier |
| `MODIFIER_QUANTITE` | `{ id, quantite }` | Change la quantité d'un produit existant |
| `VIDER_PANIER` | aucun | Remet le panier à zéro |

### Schéma de flux

```
Composant
   │
   │  dispatch({ type: 'AJOUTER_ARTICLE', payload: produit })
   ▼
Reducer (fonction pure)
   │
   │  retourne un nouvel état
   ▼
CartContext.Provider
   │
   │  re-rend les composants abonnés
   ▼
Composants consommateurs (panier, badge, total...)
```

---

## ThemeContext — Contexte simple (useState)

### Pourquoi pas de reducer ?

Le thème n'a que deux états possibles (`'light'` / `'dark'`) et une seule action (basculer). Un simple `useState` avec une fonction `toggleTheme` suffit.

### L'état

```ts
type ThemeState = {
  theme: 'light' | 'dark';
  isDark: boolean;          // raccourci pratique pour les composants
};
```

### Les tokens de couleur

Le contexte exposera également les couleurs adaptées au thème courant (via `lightColors` / `darkColors`). Les composants n'ont qu'à appeler `useTheme()` pour obtenir les bonnes couleurs, sans if/else dans chaque fichier.

```ts
// Dans un composant :
const { isDark, colors, toggleTheme } = useTheme();
// colors.background, colors.text... s'adaptent au thème
```

---

## NotificationContext — Contexte simple (useState)

### Rôle

Afficher des messages temporaires (toasts) à l'utilisateur, par exemple :
- ✅ "Produit ajouté au panier"
- ❌ "Erreur lors de la commande"
- ℹ️ "Panier vidé"

### L'état

```ts
type Notification = {
  id: string;          // identifiant unique (Date.now() par ex.)
  message: string;     // texte affiché
  type: 'success' | 'error' | 'info';
};
```

### API exposée

| Fonction | Paramètres | Action |
|----------|-----------|--------|
| `showNotification` | `(message, type?)` | Ajoute une notification (auto-supprimée après 3s) |
| `removeNotification` | `(id)` | Supprime une notification manuellement |

---

## Vue d'ensemble de l'architecture

```
<RootLayout>
  <ThemeProvider>           ← thème global (persisté)
    <CartProvider>          ← panier (reducer)
      <NotificationProvider>← toasts temporaires
        <App />
      </NotificationProvider>
    </CartProvider>
  </ThemeProvider>
</RootLayout>
```

> **Ordre d'imbrication** : ThemeProvider en dehors de tout car le thème influence potentiellement les notifications elles-mêmes. CartProvider avant NotificationProvider car les actions du panier déclenchent des notifications.

---

## Résumé des choix

| Contexte | Mécanisme | Justification |
|----------|-----------|---------------|
| `CartContext` | `useReducer` | Plusieurs actions distinctes, logique complexe |
| `ThemeContext` | `useState` | Toggle binaire simple |
| `NotificationContext` | `useState` | Liste dynamique simple, pas de logique métier |

---

## Prochaines étapes

- **Étape 2** : Implémenter les reducers, providers et hooks custom dans chaque fichier de contexte
- **Étape 3** : Consommer les contextes dans les composants (liste de produits, bouton ajout, badge panier, switch thème...)
