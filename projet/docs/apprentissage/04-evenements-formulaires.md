# Chapitre 4 — Événements & formulaires

[← useState](03-usestate.md) | [Index](README.md) | [Suivant : Conditional rendering →](05-conditional-rendering.md)

---

## Concept

En React Native, les événements sont des **callbacks passés en props**. Pas de `addEventListener` — tout passe par le JSX.

## Dans ton code

[LoginScreen.tsx:71-82](../../src/features/auth/screens/LoginScreen.tsx#L71-L82) :

```tsx
<TextInput
  style={[styles.input, errors.email ? styles.inputError : null]}
  placeholder="Email"
  value={email}                         // ← contrôlé par le state
  onChangeText={setEmail}               // ← appelé à chaque frappe
  onBlur={() => markTouched('email')}   // ← appelé quand l'input perd le focus
  keyboardType="email-address"
  autoCapitalize="none"
  editable={!loading}                   // ← désactivé pendant le chargement
/>
```

## "Controlled component"

- La **valeur** de l'input vient du state (`value={email}`).
- Le **changement** met à jour le state (`onChangeText={setEmail}`).

C'est la boucle fondamentale : state → value → user types → setState → re-render → nouvelle value affichée.

## Validation progressive

[LoginScreen.tsx:33-43](../../src/features/auth/screens/LoginScreen.tsx#L33-L43) :

```tsx
const getErrors = () => ({
  email: touched.email && !isValidEmail(email)
    ? 'Adresse email invalide'
    : undefined,
  password: touched.password && password.length < 8
    ? 'Minimum 8 caracteres'
    : undefined,
});

const errors = getErrors();
const isFormValid = isValidEmail(email) && password.length >= 8;
```

Le champ `touched` évite d'afficher "email invalide" dès l'écran d'ouverture. On n'affiche l'erreur qu'après que l'utilisateur ait interagi avec le champ (pattern classique UX).

## Questions pour la soutenance

- Qu'est-ce qu'un "controlled component" ?
- Pourquoi utiliser `touched` avant d'afficher les erreurs ?
- Pourquoi `editable={!loading}` est important ? (Réponse : éviter la double soumission.)
