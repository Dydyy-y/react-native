# Chapitre 1 — JSX & composants

[← Retour à l'index](README.md) | [Suivant : Props & TypeScript →](02-props-typescript.md)

---

## Ce qu'il faut comprendre

**JSX** est une extension de syntaxe JavaScript qui ressemble à du HTML mais qui est en réalité transformée en appels de fonction par le compilateur (Babel).

```tsx
// Ce que tu écris
<View style={styles.container}>
  <Text>Hello</Text>
</View>

// Ce que le compilateur produit (simplifié)
React.createElement(View, { style: styles.container },
  React.createElement(Text, null, 'Hello')
);
```

**Un composant React est une fonction** qui retourne du JSX. Son nom **DOIT commencer par une majuscule** (sinon React pense que c'est une balise HTML/native).

## Dans ton code

[App.tsx](../../App.tsx) : ton composant racine.

```tsx
export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        {/* ... */}
      </AuthProvider>
    </UIProvider>
  );
}
```

C'est une fonction qui retourne du JSX. `UIProvider`, `AuthProvider`, etc. sont des composants (majuscules). On les **imbrique** comme des poupées russes — c'est le principe de **composition** en React.

## La prop spéciale `children`

Quand tu écris `<AuthProvider>...</AuthProvider>`, tout ce qui est entre les balises est passé au composant via la prop `children`.

Dans [AuthContext.tsx:75](../../src/features/auth/contexts/AuthContext.tsx#L75) :

```tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ...
  return (
    <AuthContext.Provider value={...}>
      {children}  {/* ← tout ce qui est imbriqué est rendu ici */}
    </AuthContext.Provider>
  );
};
```

## Questions pour la soutenance

- Pourquoi les noms de composants commencent-ils par une majuscule ?
- Que se passe-t-il si je fais `<View>{null}</View>` ? (Réponse : rien, React ignore `null`, `undefined`, `false`)
- Quelle est la différence entre un composant et un élément React ?
