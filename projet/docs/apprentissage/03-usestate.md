# Chapitre 3 — State avec `useState`

[← Props & TypeScript](02-props-typescript.md) | [Index](README.md) | [Suivant : Événements →](04-evenements-formulaires.md)

---

## Concept

Les **props viennent du parent**, le **state est interne au composant**. Quand le state change, React **re-render** le composant (= rappelle la fonction, reconstruit le JSX, met à jour l'écran).

## Dans ton code

[LoginScreen.tsx:26-28](../../src/features/auth/screens/LoginScreen.tsx#L26-L28) :

```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [touched, setTouched] = useState({ email: false, password: false });
```

**Anatomie :**

- `useState('')` retourne un **tableau de 2 éléments** : la valeur actuelle, et la fonction pour la changer.
- Destructuring array : `[email, setEmail] = useState('')`.
- La valeur passée à `useState()` est l'**état initial** (utilisé uniquement au premier rendu).

## Règle d'or : l'immutabilité

**JAMAIS** muter le state directement :

```tsx
// ❌ MAUVAIS
touched.email = true;
setTouched(touched);  // React ne voit pas de changement (même référence)

// ✅ BON
setTouched(prev => ({ ...prev, email: true }));
```

[LoginScreen.tsx:30-31](../../src/features/auth/screens/LoginScreen.tsx#L30-L31) :

```tsx
const markTouched = (field: 'email' | 'password') =>
  setTouched((prev) => ({ ...prev, [field]: true }));
```

Tu crées un **nouvel objet** avec `{ ...prev, [field]: true }`. React compare les références (`===`) pour détecter les changements — une mutation sur le même objet serait invisible.

## Version "fonctionnelle" du setter

Quand le nouveau state **dépend du précédent**, utilise la forme `setX(prev => ...)`. C'est plus sûr en cas d'updates asynchrones multiples.

## Questions pour la soutenance

- Que retourne `useState` exactement ?
- Pourquoi est-ce que `setTouched({...touched, email: true})` marche mais pas `touched.email = true; setTouched(touched)` ?
- Quand utiliser la forme `setX(prev => ...)` plutôt que `setX(value)` ?
