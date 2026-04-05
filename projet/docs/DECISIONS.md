# Décisions d'Architecture — Space Conquest Online

> **But de ce fichier** : Expliquer le *pourquoi* de chaque choix technique et architectural.
> **Règle** : Toute décision importante (nouvelle dépendance, nouveau pattern, changement structurel) DOIT être documentée ici.
> **Format** : Pour chaque décision → Contexte · Décision prise · Alternatives rejetées · Conséquences.

---

## Table des matières

1. [Stack de base : React Native + Expo + TypeScript](#1-stack-de-base--react-native--expo--typescript)
2. [Gestion d'état : Context API + useReducer (pas Redux)](#2-gestion-détat--context-api--usereducer-pas-redux)
3. [Architecture Feature-Folder](#3-architecture-feature-folder)
4. [4 Contexts séparés (pas un seul store global)](#4-4-contexts-séparés-pas-un-seul-store-global)
5. [Stockage des tokens : expo-secure-store (pas AsyncStorage)](#5-stockage-des-tokens--expo-secure-store-pas-asyncstorage)
6. [Appels API : Axios (pas fetch natif)](#6-appels-api--axios-pas-fetch-natif)
7. [Polling HTTP à 30s minimum (pas WebSocket)](#7-polling-http-à-30s-minimum-pas-websocket)
8. [Navigation : TabsNavigator obligatoire](#8-navigation--tabsnavigator-obligatoire)
9. [Logique API dans les services, pas les composants](#9-logique-api-dans-les-services-pas-les-composants)
10. [Hooks pour les données API](#10-hooks-pour-les-données-api)
11. [Interceptors Axios pour le token + logout automatique](#11-interceptors-axios-pour-le-token--logout-automatique)
12. [Pas d'imports croisés entre features](#12-pas-dimports-croisés-entre-features)
13. [Imbrication des Providers dans App.tsx](#13-imbrication-des-providers-dans-apptsx)
14. [.gitignore : ce qu'on exclut et pourquoi](#14-gitignore--ce-quon-exclut-et-pourquoi)
15. *(Sprint 4 — voir section 15)*
16. [Detection d'elimination du joueur](#16-detection-delimination-du-joueur-sprint-6)
17. [Ecran de fin de partie avec stats serveur](#17-ecran-de-fin-de-partie-avec-stats-serveur-sprint-6)
18. [Modification du profil via PUT /profile](#18-modification-du-profil-via-put-profile-sprint-6)
19. [Historique des parties](#19-historique-des-parties-sprint-6)
20. [Correction endpoint /ship-types](#20-correction-endpoint-ship-types-sprint-5-fix)

---

## 1. Stack de base : React Native + Expo + TypeScript

**Contexte**
Le projet est une application mobile (iOS + Android) client d'un jeu multijoueur. Il est développé dans le cadre d'un cours d'introduction au développement mobile.

**Décision**
React Native avec le framework Expo, en TypeScript strict.

**Pourquoi React Native (pas Flutter, pas Swift natif) ?**
- Contrainte de la consigne : React Native est imposé.
- En dehors de la contrainte : React Native permet de cibler iOS et Android avec une seule base de code, et la courbe d'apprentissage est accessible pour quelqu'un venant du web (React).

**Pourquoi Expo (pas bare React Native) ?**
- Contrainte de la consigne : Expo est imposé.
- En dehors de la contrainte : Expo simplifie considérablement le setup (pas besoin de Xcode/Android Studio pour tester), fournit des modules natifs prêts à l'emploi (`expo-secure-store`, `expo-camera`...) et gère le build cloud via EAS.
- Expo Go permet de tester sur un vrai téléphone en scannant un QR code — pratique pour un projet étudiant.

**Pourquoi TypeScript strict (pas JavaScript) ?**
- Contrainte de la consigne : TypeScript strict est imposé.
- En dehors de la contrainte : TypeScript prévient les bugs à la compilation (typage des réponses API, props des composants, payloads des reducers). Sur un projet avec plusieurs features et une API externe, les erreurs de type sont très fréquentes sans typage. Le mode `strict` désactive les "sorties de secours" (`any` implicite, null unchecked, etc.).

**Conséquences**
- Tous les fichiers sont en `.ts` ou `.tsx`.
- `tsconfig.json` a `"strict": true`.
- Aucun `any` sans commentaire justificatif.

---

## 2. Gestion d'état : Context API + useReducer (pas Redux)

**Contexte**
L'application a un état global non trivial : utilisateur authentifié, session de jeu en cours, état de la carte, toasts UI. Cet état doit être partagé entre plusieurs écrans.

**Décision**
Context API + useReducer natif React, uniquement.

**Pourquoi pas Redux ?**
- Contrainte de la consigne : Redux est explicitement interdit.
- En dehors de la contrainte : Redux ajoute du boilerplate (actions, reducers, selectors, middleware) et une dépendance externe. Pour une app de cette taille, c'est sur-engineering. Redux est pertinent pour des apps avec des dizaines de features et des interactions complexes entre states.

**Pourquoi pas Zustand ?**
- Contrainte de la consigne : Zustand est explicitement interdit.
- En dehors de la contrainte : Zustand est plus simple que Redux, mais reste une dépendance externe. La consigne veut que l'étudiant maîtrise les outils React natifs.

**Pourquoi useReducer (pas useState seul) ?**
- Quand un état a plusieurs sous-valeurs qui évoluent ensemble (ex: `{ user, token, loading, error }`), `useReducer` est plus lisible que plusieurs `useState` indépendants.
- Le pattern `dispatch({ type: 'SET_ERROR', payload: msg })` rend l'intention explicite et traçable.
- Facilite le débogage : on peut logger chaque action.

**Conséquences**
- Chaque feature a son propre Context + Reducer.
- Les transitions d'état sont des actions typées (union types TypeScript).
- Pas de middleware, pas de devtools Redux (on peut logger manuellement dans le reducer si besoin).

---

## 3. Architecture Feature-Folder

**Contexte**
Il faut organiser ~30-40 fichiers (screens, services, hooks, types, contexts) de manière maintenable.

**Décision**
Organisation par feature (`auth/`, `lobby/`, `game/`, `ui/`) plutôt que par type de fichier.

**Pourquoi Feature-Folder (pas Layer-Folder) ?**

Layer-Folder aurait donné :
```
screens/LoginScreen.tsx
screens/LobbyScreen.tsx
services/authService.ts
services/lobbyService.ts
contexts/AuthContext.tsx
...
```

Feature-Folder donne :
```
features/auth/screens/LoginScreen.tsx
features/auth/services/authService.ts
features/auth/contexts/AuthContext.tsx
features/lobby/screens/LobbyScreen.tsx
...
```

Avantages du Feature-Folder :
- **Cohésion** : tous les fichiers d'une feature sont au même endroit. Quand on travaille sur `auth`, on n'ouvre que `features/auth/`.
- **Scalabilité** : ajouter une feature = créer un dossier, pas toucher à tous les dossiers existants.
- **Suppression facile** : supprimer une feature = supprimer un dossier.
- **Clarté des dépendances** : les imports croisés entre features sont visibles et contrôlables.

**Conséquences**
- Chaque feature expose un `index.ts` (barrel export) — les autres parties du code importent depuis ce point d'entrée uniquement.
- Le dossier `shared/` contient ce qui est réellement partagé entre features.

---

## 4. 4 Contexts séparés (pas un seul store global)

**Contexte**
On aurait pu mettre tout l'état dans un seul `AppContext`.

**Décision**
4 contexts indépendants : `AuthContext`, `LobbyContext`, `GameContext`, `UIContext`.

**Pourquoi pas un seul context ?**
- **Performance** : un context re-render tous ses consommateurs à chaque changement. Si `GameContext` (mis à jour toutes les 30s via polling) est dans le même context que `AuthContext`, chaque mise à jour du jeu re-render tous les composants qui lisent l'auth — même si rien n'a changé pour eux.
- **Séparation des responsabilités** : chaque context a une responsabilité claire. `AuthContext` ne sait rien du jeu, `GameContext` ne sait rien des toasts.
- **Testabilité** : on peut mocker un seul context dans les tests sans impacter les autres.
- **Cohérence avec Feature-Folder** : chaque feature gère son propre état, comme elle gère ses propres fichiers.

**Pourquoi cet ordre d'imbrication dans App.tsx ?**
```
UIProvider > AuthProvider > LobbyProvider > GameProvider
```
- `UIProvider` est le plus externe : les toasts et modals doivent s'afficher par-dessus tout, y compris les erreurs venant de n'importe quel autre context.
- `AuthProvider` vient en second : la quasi-totalité de l'app dépend de l'état d'authentification (le `RootNavigator` lit `AuthContext` pour décider d'afficher `AuthStack` ou `AppTabs`).
- `LobbyProvider` et `GameProvider` sont plus internes car ils ne sont utilisés que dans leurs écrans respectifs.

**Conséquences**
- Chaque composant n'importe que le context dont il a besoin.
- Re-renders ciblés.
- Plus de fichiers (4 contexts au lieu d'un), mais bien plus maintenable.

---

## 5. Stockage des tokens : expo-secure-store (pas AsyncStorage)

**Contexte**
Après login, l'API retourne un JWT (token d'accès). Ce token doit être persisté entre les sessions (pour ne pas redemander à l'utilisateur de se reconnecter à chaque ouverture de l'app).

**Décision**
Utiliser `expo-secure-store` pour stocker le token.

**Pourquoi pas AsyncStorage ?**
- `AsyncStorage` est un stockage clé-valeur **non chiffré**. N'importe quelle app sur un téléphone rooté peut lire son contenu. C'est inacceptable pour un token d'authentification.
- `expo-secure-store` utilise le **Keychain iOS** et le **Android Keystore** — des zones de stockage chiffrées par le système d'exploitation, protégées par le hardware du téléphone.
- C'est une contrainte de la consigne, mais c'est aussi la bonne pratique universelle pour les tokens.

**Pourquoi pas les cookies httpOnly ?**
- Nous sommes dans une app mobile, pas un navigateur web. Les cookies httpOnly sont une solution web (navigateur gère les cookies automatiquement). Dans une app React Native, il faudrait une gestion manuelle complexe — `expo-secure-store` est plus adapté.

**Conséquences**
- `expo-secure-store` est une API async (`await SecureStore.getItemAsync(...)`).
- L'interceptor Axios doit être `async` pour lire le token avant chaque requête.
- À la déconnexion : `SecureStore.deleteItemAsync('access_token')`.
- Ne jamais stocker le token dans du state React ou une variable globale JS (perte au redémarrage + accessible en mémoire).

---

## 6. Appels API : Axios (pas fetch natif)

**Contexte**
L'app communique avec une API REST externe. Toutes les requêtes doivent envoyer un header `Authorization: Bearer {token}`.

**Décision**
Axios avec une instance partagée (`apiClient.ts`), pas le `fetch` natif.

**Pourquoi Axios (pas fetch) ?**

| Critère | fetch natif | Axios |
|---------|-------------|-------|
| Interceptors (avant/après requête) | Non natif, workaround complexe | Natif (`interceptors.request`, `interceptors.response`) |
| Gestion automatique du JSON | Manuel (`response.json()`) | Automatique |
| Gestion des erreurs HTTP (4xx, 5xx) | Ne rejette pas la promesse sur 4xx/5xx | Rejette la promesse → `catch` fonctionne naturellement |
| Instance partagée avec config commune | Non | Oui (`axios.create({ baseURL, timeout })`) |
| Timeout | Manuel avec `AbortController` | `timeout: 10000` dans la config |

- Contrainte de la consigne : Axios est imposé.
- L'avantage principal pour nous : **les interceptors**. Ils permettent d'injecter le token dans toutes les requêtes et de gérer le 401 en un seul endroit, sans toucher à chaque appel API individuellement.

**Conséquences**
- Une seule instance Axios dans `shared/config/apiClient.ts`.
- Tous les services importent cette instance, jamais `axios` directement.
- Le `baseURL` est défini une seule fois.

---

## 7. Polling HTTP à 30s minimum (pas WebSocket)

**Contexte**
Le jeu est multijoueur en temps réel (les joueurs se voient rejoindre le lobby, l'état du jeu évolue). L'app doit détecter ces changements.

**Décision**
Polling HTTP toutes les 30 secondes minimum, via le hook `usePolling`.

**Pourquoi pas WebSocket ?**
- L'API fournie ne propose pas de WebSocket — elle est REST uniquement. On ne peut pas utiliser ce qui n'existe pas côté serveur.
- Si l'API avait des WebSockets, ce serait la meilleure approche (push serveur, latence quasi nulle, pas de requêtes inutiles).

**Pourquoi 30 secondes minimum ?**
- L'API a une **rate limit de 20 requêtes par minute** (mentionné dans la consigne).
- Si on poll toutes les secondes, on dépasse rapidement cette limite et on reçoit des erreurs 429 (Too Many Requests).
- 30 secondes = 2 req/min, ce qui laisse de la marge pour les autres requêtes (actions du joueur, chargement initial...).

**Pourquoi un hook `usePolling` générique ?**
- Le polling est nécessaire dans au moins 2 features : `lobby` (liste des joueurs) et `game` (état du jeu).
- Plutôt que de dupliquer le `setInterval` + cleanup dans chaque composant, un hook réutilisable garantit que le cleanup (`clearInterval`) est toujours effectué au démontage du composant — évitant des memory leaks.

**Conséquences**
- `usePolling(callback, 30000, enabled)` prend un booléen `enabled` pour activer/désactiver selon les besoins.
- Le polling ne tourne que quand l'écran concerné est monté.
- Latence maximale : 30 secondes avant de voir une mise à jour.

---

## 8. Navigation : TabsNavigator obligatoire

**Contexte**
L'app a 3 zones principales : Lobby, Jeu, Profil. L'utilisateur doit pouvoir naviguer entre elles facilement.

**Décision**
`AppTabs` avec `@react-navigation/bottom-tabs` comme navigation principale de l'app authentifiée.

**Pourquoi TabsNavigator (pas StackNavigator seul) ?**
- Contrainte de la consigne : TabsNavigator est obligatoire.
- En dehors de la contrainte : les tabs en bas sont le pattern mobile le plus intuitif pour des sections de niveau équivalent. L'utilisateur voit en permanence où il se trouve et peut changer de section en un tap.

**Pourquoi `RootNavigator` avec condition auth ?**
```typescript
if (state.loading) return <SplashScreen />;
if (!state.token) return <AuthStack />;
return <AppTabs />;
```
- C'est le pattern standard React Navigation pour les apps avec authentification.
- Le `SplashScreen` est affiché pendant que l'app vérifie si un token valide existe en `SecureStore` (opération async au démarrage).
- Avantage : impossible d'accéder aux écrans de l'app sans token — la sécurité est garantie au niveau de la navigation, pas seulement de l'API.

**Conséquences**
- `AuthStack` et `AppTabs` sont deux navigateurs totalement séparés.
- Un utilisateur déconnecté ne peut jamais accéder aux tabs du jeu.
- Le 401 → logout déclenche un changement d'état dans `AuthContext` → le `RootNavigator` re-render → l'utilisateur est renvoyé vers `AuthStack` automatiquement.

---

## 9. Logique API dans les services, pas les composants

**Contexte**
On pourrait appeler `axios.post('/auth/login', ...)` directement dans un composant React.

**Décision**
Toute logique API est dans des fichiers `*Service.ts` dans chaque feature.

**Pourquoi ?**
- **Séparation des responsabilités** : un composant React est responsable de l'affichage, pas de la communication réseau.
- **Réutilisabilité** : `authService.login(...)` peut être appelé depuis le hook `useLogin`, depuis un test, ou depuis un autre endroit — sans dupliquer la logique.
- **Testabilité** : on peut mocker `authService` dans les tests des composants sans avoir à intercepter Axios directement.
- **Lisibilité** : le composant reste petit et lisible. La complexité réseau est cachée dans le service.
- **Maintenabilité** : si l'endpoint change, on modifie le service — pas chaque composant qui l'utilise.

**Conséquences**
- Les services ne font qu'une chose : appeler l'API et retourner les données typées.
- Ils n'ont pas d'accès aux contexts, pas de side effects — juste des fonctions pures (async).
- Un service = une fonction par endpoint utilisé.

---

## 10. Hooks pour les données API

**Contexte**
Les services retournent des données, mais il faut aussi gérer `loading`, `error`, et le déclenchement de l'action dans les composants.

**Décision**
Les données API sont accédées via des hooks custom (`useLogin`, `useGame`, etc.) qui encapsulent l'appel au service + la mise à jour du context.

**Pourquoi des hooks (pas appeler le service directement dans le composant) ?**
- **Contrainte de la consigne** : les données de récupération API doivent être des hooks.
- En dehors de la contrainte : un hook regroupe la logique de `loading`, `error`, et l'appel service en un seul endroit réutilisable.
- Le composant fait juste : `const { execute, loading, error } = useLogin();` — tout le reste est dans le hook.

**Pattern utilisé :**
```
Composant
  → appelle useLogin()
    → appelle authService.login()
      → appelle apiClient.post()
    → dispatch(AuthContext) avec le résultat
```

**Conséquences**
- Les hooks sont dans `features/*/hooks/`.
- Le hook générique `useApi` (dans `shared/hooks/`) fournit la mécanique `loading/error/execute` réutilisable.
- Les hooks spécifiques (ex: `useLogin`) utilisent `useApi` + accèdent au context pour dispatcher.

---

## 11. Interceptors Axios pour le token + logout automatique

**Contexte**
Toutes les routes API (sauf `/auth/login` et `/auth/register`) nécessitent un header `Authorization: Bearer {token}`.

**Décision**
Deux interceptors dans `apiClient.ts` : un sur les requêtes (injecter le token), un sur les réponses (gérer le 401).

**Pourquoi des interceptors (pas ajouter le header manuellement dans chaque service) ?**
- **DRY (Don't Repeat Yourself)** : si on ajoute le header dans chaque service, on a 10+ endroits à maintenir. Si le nom du header change, on doit tout modifier.
- **Sécurité** : on ne peut pas "oublier" d'ajouter le header sur un endpoint — c'est systématique.
- **Logout automatique sur 401** : l'interceptor de réponse détecte un 401 (token expiré/invalide), supprime le token du SecureStore et déclenche le logout — sans que chaque service ait à gérer ce cas.

**Pourquoi l'interceptor de requête est `async` ?**
```typescript
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  ...
```
- `SecureStore.getItemAsync` est une opération asynchrone (lecture depuis le keychain natif).
- Axios supporte les interceptors async nativement.

**Conséquences**
- `apiClient.ts` est le seul fichier qui sait comment s'authentifier.
- Les services n'ont jamais connaissance des tokens.
- Une expiration de token → logout automatique et transparent.

---

## 12. Pas d'imports croisés entre features

**Contexte**
On pourrait avoir envie, depuis `game/`, d'importer un composant de `lobby/`.

**Décision**
Les features ne s'importent pas entre elles. Tout ce qui doit être partagé passe par `shared/`.

**Pourquoi ?**
- **Couplage** : si `game/` importe depuis `lobby/`, on crée une dépendance cachée. Modifier `lobby/` peut casser `game/` sans que ce soit évident.
- **Lisibilité** : en regardant les imports d'un fichier, on sait immédiatement s'il dépend d'une feature externe (interdit) ou de `shared/` (autorisé).
- **Réutilisabilité** : si un composant est utilisé par 2+ features, c'est qu'il appartient à `shared/` (ou `ui/`), pas à une feature spécifique.

**Règle pratique :**
- Un composant utilisé par une seule feature → il reste dans cette feature.
- Un composant utilisé par plusieurs features → il monte dans `shared/` ou `features/ui/`.

**Conséquences**
- `features/ui/` sert de bibliothèque de composants partagés (Button, Input, Toast...).
- `shared/` contient les hooks, types, utils et config utilisés partout.

---

## 13. Imbrication des Providers dans App.tsx

**Contexte**
Les 4 Providers doivent envelopper toute l'application.

**Décision**
```typescript
<UIProvider>
  <AuthProvider>
    <LobbyProvider>
      <GameProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GameProvider>
    </LobbyProvider>
  </AuthProvider>
</UIProvider>
```

**Pourquoi cet ordre précis ?**

| Provider | Position | Raison |
|----------|----------|--------|
| `UIProvider` | Plus externe | Les toasts/modals doivent être disponibles partout, y compris pour afficher les erreurs venant de n'importe quel context |
| `AuthProvider` | 2e | Le `RootNavigator` lit l'auth pour décider quelle navigation afficher. Il doit avoir accès à `AuthContext` dès le premier render |
| `LobbyProvider` | 3e | Utilisé uniquement dans les écrans de lobby, mais doit être disponible avant `GameProvider` car une session lobby précède toujours une partie |
| `GameProvider` | Plus interne | Utilisé uniquement dans les écrans de jeu, qui sont les plus profonds dans la navigation |
| `NavigationContainer` | À l'intérieur de tous les providers | Les écrans ont besoin d'accéder aux contexts → ils doivent être enfants des providers |

**Conséquences**
- `App.tsx` est le seul endroit où les providers sont imbriqués.
- L'ordre n'est pas arbitraire — le changer pourrait créer des erreurs "context used outside of provider".

---

## 14. .gitignore : ce qu'on exclut et pourquoi

**Contexte**
Un repo git ne doit contenir que ce qui est utile et partageable entre développeurs.

**Décision**
`.gitignore` configuré pour Expo + React Native + Node.

| Élément exclu | Raison |
|---------------|--------|
| `node_modules/` | Des milliers de fichiers générés. Se réinstallent avec `npm install`. Versioner = repo de plusieurs Go |
| `.expo/` | Cache local de l'outil Expo CLI. Spécifique à la machine, contient des paths absolus locaux |
| `dist/`, `web-build/` | Artefacts de build. Se regénèrent, ne doivent pas être versionnés |
| `ios/`, `android/` | Dossiers natifs générés par Expo lors d'un `expo prebuild`. Se regénèrent et contiennent des configs machine-spécifiques |
| `.env*` | Variables d'environnement. Peuvent contenir des clés API, des secrets — **jamais dans git** sous peine de fuite de credentials |
| `*.jks`, `*.p12`, `*.key` | Certificats de signature d'app. Ce sont des secrets cryptographiques — les committer = les compromettre |
| `.DS_Store` | Fichier macOS invisible créé automatiquement dans chaque dossier. N'a aucune utilité pour le projet |
| `*.log` | Logs de debug. Volumineux, inutiles pour les autres développeurs, changent à chaque exécution |

**Conséquences**
- Un `git clone` suivi de `npm install` redonne exactement l'environnement de travail.
- Aucun secret ne peut fuiter accidentellement via git.

---

## 15. Configuration du apiClient via callbacks injectés (pas d'import direct depuis shared vers features)

**Contexte**
L'interceptor Axios doit lire le token depuis `expo-secure-store` (dans `features/auth/services/tokenStorage.ts`) et déclencher le logout (dans `features/auth/contexts/AuthContext.tsx`). Importer directement ces modules depuis `shared/config/apiClient.ts` violerait la règle "pas d'imports depuis shared vers features".

**Décision**
Le `apiClient.ts` expose une fonction `configureApiClient(getToken, onUnauthorized)`. L'`AuthProvider` appelle cette fonction au montage avec les callbacks appropriés.

**Pourquoi cette approche (pas d'import direct) ?**
- **Respect de la règle d'architecture** : `shared/` ne doit pas dépendre de `features/`. L'injection inverse ce sens de dépendance.
- **Testabilité** : les callbacks peuvent être mockés en test sans importer le SecureStore.
- **Ref pour éviter les closures périmées** : `AuthProvider` utilise un `useRef` pour que la callback de logout soit toujours la version courante, même si l'effet ne se ré-exécute qu'au montage.

**Conséquences**
- `apiClient.ts` ne connaît pas `features/auth/` — dépendance unidirectionnelle conservée.
- `AuthProvider` appelle `configureApiClient` dans un `useEffect([], [])` avec une ref stable.

---

## 16. Ajout de react-native-gesture-handler

**Contexte**
`@react-navigation/stack` v7 requiert `react-native-gesture-handler` pour les animations de navigation. Cette dépendance n'était pas dans le `package.json` initial.

**Décision**
Installation via `npx expo install react-native-gesture-handler` (version compatible SDK 54).

**Pourquoi (pas rester avec @react-navigation/native-stack) ?**
- `@react-navigation/stack` était déjà listé dans les dépendances initiales — c'était le choix du projet.
- `react-native-gesture-handler` est la dépendance officielle requise par ce package.
- Import ajouté en première ligne de `App.tsx` (requis par la documentation React Navigation).

**Conséquences**
- `import 'react-native-gesture-handler'` doit rester en **première ligne** de `App.tsx`.
- Expo gère la compatibilité native automatiquement via SDK.

---

## 17. Icônes des tabs : @expo/vector-icons (Ionicons)

**Contexte**
Les tabs du `AppTabs` n'avaient pas d'icônes, ce qui nuit à l'expérience utilisateur (on ne sait pas quel onglet correspond à quoi sans lire le label).

**Décision**
Utiliser `@expo/vector-icons` avec le jeu d'icônes `Ionicons` pour les icônes des tabs.

**Pourquoi @expo/vector-icons (pas react-native-vector-icons ou images custom) ?**
- `@expo/vector-icons` est inclus nativement dans Expo SDK — aucune dépendance supplémentaire à installer.
- Fournit plusieurs sets d'icônes (Ionicons, MaterialIcons, FontAwesome...) accessibles directement.
- Les icônes sont vectorielles (pas de pixellisation, s'adaptent à toutes les tailles).
- `Ionicons` a un style cohérent avec les conventions iOS/Android modernes.

**Conséquences**
- Aucune nouvelle dépendance npm ajoutée.
- Les props `color` et `size` sont fournies automatiquement par le `TabNavigator` via `tabBarIcon`.

---

## 18. Hook usePolling générique dans shared/hooks/

**Contexte**
Le polling HTTP (requêtes périodiques à intervalle régulier) est nécessaire dans au moins 2 features : lobby (liste des joueurs) et game (état de jeu). La consigne impose un intervalle de 30 secondes minimum.

**Décision**
Créer un hook `usePolling(callback, interval, enabled)` dans `shared/hooks/usePolling.ts`, réutilisable par toutes les features.

**Pourquoi un hook partagé (pas du setInterval dans chaque composant) ?**
- **DRY** : évite de dupliquer la logique `setInterval` + cleanup dans chaque écran qui poll.
- **Sécurité rate limit** : le hook impose un minimum de 30s (`Math.max`), impossible de descendre en dessous par erreur.
- **Cleanup automatique** : le `clearInterval` dans le return de `useEffect` évite les memory leaks au démontage du composant.
- **Ref pour callback** : `useRef` sur le callback évite de recréer le timer à chaque changement de closure — le polling reste stable.
- **Paramètre `enabled`** : permet d'activer/désactiver dynamiquement (ex: arrêter le polling quand les actions sont validées, reprendre quand le nouveau tour commence).

**Conséquences**
- Toute feature qui a besoin de polling importe depuis `shared/hooks/usePolling`.
- Le callback gère ses propres erreurs (le hook ne les intercepte pas).
- Appel immédiat au montage, puis toutes les N secondes.

---

## 19. Styles partagés entre écrans d'auth

**Contexte**
`LoginScreen` et `SignUpScreen` avaient des StyleSheet quasi identiques (90%+), ce qui constituait une duplication inutile.

**Décision**
Extraire les styles communs dans `features/auth/styles/authStyles.ts`, importé par les deux écrans.

**Pourquoi un fichier dans auth/ (pas dans shared/) ?**
- Ces styles sont spécifiques aux écrans d'authentification, pas partagés entre features.
- Respecte le principe Feature-Folder : ce qui appartient à une feature reste dans cette feature.

**Conséquences**
- Un seul endroit pour modifier le look des formulaires d'auth.
- Les deux écrans importent `authStyles` au lieu de redéfinir chacun leur StyleSheet.

---

## 20. Filtre des routes d'auth dans l'interceptor 401

**Contexte**
L'interceptor Axios de réponse déclenche un `logout()` sur tout 401. Mais les routes `/auth/login` et `/auth/register` peuvent aussi retourner 401 (identifiants incorrects). Déclencher `logout()` dans ce cas est sémantiquement incorrect (l'utilisateur n'est pas encore connecté).

**Décision**
L'interceptor vérifie si l'URL commence par `/auth/` avant de déclencher le `_onUnauthorized`. Les 401 sur les routes d'auth sont ignorés par l'interceptor et gérés normalement par le catch du service.

**Conséquences**
- Un login raté ne déclenche plus de dispatch LOGOUT parasite.
- Les 401 sur les routes protégées continuent de déclencher le logout automatique.

---

## 21. NavigationContainer dans App.tsx (pas dans RootNavigator)

**Contexte**
Le `NavigationContainer` était initialement dans `RootNavigator.tsx`. Avec l'ajout futur de `LobbyProvider` et `GameProvider` dans `App.tsx`, la hiérarchie était incohérente avec l'architecture documentée.

**Décision**
Déplacer `NavigationContainer` et `ToastContainer` dans `App.tsx`. Le `RootNavigator` ne contient plus que la logique conditionnelle (auth check).

**Pourquoi ?**
- `App.tsx` est le point d'entrée : il gère les providers ET le container de navigation.
- `RootNavigator` a une seule responsabilité : décider quel navigateur afficher.
- Prépare proprement l'ajout de `LobbyProvider` et `GameProvider` autour du `NavigationContainer`.

**Conséquences**
- `RootNavigator` est simplifié (plus d'import NavigationContainer ni ToastContainer).
- L'ajout de futurs providers se fait dans `App.tsx` sans toucher au navigateur.

---

## Comment documenter une nouvelle décision

Quand tu ajoutes quelque chose d'important au projet, **ajoute une entrée ici** avec ce format :

```markdown
## N. Titre de la décision

**Contexte**
Pourquoi cette décision était nécessaire. Quel problème existait.

**Décision**
Ce qu'on a choisi de faire.

**Pourquoi [option choisie] (pas [alternative]) ?**
- Raison 1
- Raison 2

**Conséquences**
Ce que cette décision implique concrètement dans le code.
```

**Décisions qui méritent d'être documentées :**
- Ajout d'une dépendance npm
- Nouveau pattern de code introduit
- Changement de structure de dossiers
- Choix d'une lib plutôt qu'une autre
- Décision de sécurité
- Workaround non évident

---

## 22. QR Code : react-native-qrcode-svg pour la generation, expo-camera pour le scan

**Contexte**
Le Sprint 2 (Lobby) necessite de generer un QR code contenant l'invite_code de la session, et de scanner ce QR code pour rejoindre une session.

**Decision**
- Generation : `react-native-qrcode-svg` (+ `react-native-svg` en peer dependency)
- Scan : `expo-camera` avec `CameraView` et `barcodeScannerSettings`

**Pourquoi react-native-qrcode-svg (pas react-native-qrcode ou une image statique) ?**
- Rendu vectoriel SVG : le QR code est net a toutes les tailles, pas de pixellisation.
- Compatible React Native + Expo sans config native.
- API simple : `<QRCode value={code} size={200} />`.

**Pourquoi expo-camera pour le scan (pas expo-barcode-scanner) ?**
- `expo-barcode-scanner` est deprecie depuis SDK 51.
- `expo-camera` SDK 54 integre le scan de codes-barres dans `CameraView` via `barcodeScannerSettings` et `onBarcodeScanned`.
- Un seul package pour la camera et le scan.

**Consequences**
- `react-native-svg` est une dependance transitive necessaire.
- La permission camera est demandee via `useCameraPermissions()` d'expo-camera.
- Le QR code contient uniquement l'`invite_code` (UUID) retourne par l'API.

---

## 23. Endpoints API : /game-sessions (pas /sessions)

**Contexte**
Le PRD initial supposait des endpoints en `/sessions`. La documentation Swagger de l'API revele que les vrais endpoints sont en `/game-sessions`.

**Decision**
Utiliser les endpoints reels de l'API dans `sessionService.ts` :
- `POST /game-sessions` (creer)
- `GET /game-sessions/{id}` (polling)
- `POST /game-sessions/join` avec `{ invite_code }` (rejoindre)
- `POST /game-sessions/{id}/leave` (quitter)
- `DELETE /game-sessions/{id}` (supprimer)
- `POST /game-sessions/{id}/start` (demarrer)
- `POST /game-sessions/{id}/kick` avec `{ player_id }` (expulser)
- `POST /game-sessions/{id}/ban` avec `{ player_id }` (bannir)

**Consequences**
- Le service inclut deja les endpoints de moderation (Sprint 3) pour eviter de le modifier plus tard.
- L'`invite_code` est un UUID (pas un code court), c'est ce qui est encode dans le QR code.

---

## 24. LobbyStack dans le tab Lobby (Stack imbriqué dans Tab)

**Contexte**
Le tab Lobby doit naviguer entre 4 ecrans (LobbyHome, CreateSession, JoinSession, SessionDetail) tout en restant dans l'onglet Lobby.

**Decision**
Imbriquer un `Stack.Navigator` (LobbyStack) dans le tab Lobby du `Tab.Navigator` (AppTabs).

**Pourquoi un Stack dans le Tab (pas des ecrans au meme niveau) ?**
- Le Tab Navigator ne supporte qu'un ecran par tab. Pour avoir une navigation hierarchique (LobbyHome -> CreateSession -> SessionDetail), un Stack interne est necessaire.
- C'est le pattern standard React Navigation pour les tabs avec sous-navigation.
- Le header du Stack est masque sur LobbyHome (l'ecran a son propre design) et visible sur les sous-ecrans avec un bouton retour.

**Pourquoi headerLeft null sur SessionDetail ?**
- Une fois dans le salon, l'utilisateur ne doit pas "revenir en arriere" avec la fleche — il doit quitter explicitement via le bouton "Quitter" (qui fait l'appel API de leave).
- `navigation.replace` est utilise pour eviter d'empiler les ecrans dans le stack.

**Consequences**
- Le tab Lobby contient un Stack avec 4 routes.
- `navigation.replace('SessionDetail')` remplace l'ecran courant (pas de back).
- `navigation.replace('LobbyHome')` apres un leave/delete remet le stack a zero.

---

## 25. Endpoints jeu : /game-sessions/{id}/map et /game-sessions/{id}/state

**Contexte**
Le PRD supposait des endpoints `/games/{gameId}/map` et `/games/{gameId}/state`. La documentation API Swagger revele que les endpoints de jeu sont en realite sur le meme prefixe que les sessions : `/game-sessions/{id}/map`, `/game-sessions/{id}/state`, `/game-sessions/{id}/round-actions`.

**Decision**
Utiliser `/game-sessions/{id}/...` pour tous les appels jeu. Le session ID est aussi le "game ID" — pas d'identifiant de jeu separe.

**Pourquoi ?**
- L'API ne fournit pas de game_id distinct : la session EST le jeu.
- Les actions de tour utilisent `round-actions` (pas `actions`) et le type `recruit` (pas `purchase`).

**Consequences**
- `gameService.ts` utilise les memes prefixes que `sessionService.ts`.
- Le `sessionId` du LobbyContext est transmis au GameContext pour les appels jeu.

---

## 26. Grille FlatList : fond uni + icones uniquement sur cases occupees

**Contexte**
La consigne impose FlatList pour la grille et recommande de ne pas afficher d'image sur chaque case vide pour des raisons de performance.

**Decision**
- Fond uni (`COLORS.primary`) sous la grille entiere.
- Cases vides : simple `View` avec bordure fine semi-transparente.
- Ressources : icone diamant dore + fond subtil.
- Vaisseaux : icone Ionicons coloree par joueur (rocket pour fighter, construct pour miner).
- `React.memo` sur `MapCell` pour eviter les re-renders inutiles.

**Pourquoi ?**
- Performance : FlatList avec N*M cellules peut etre lent avec des images partout.
- Lisibilite : les vaisseaux et ressources se distinguent visuellement sur un fond sombre.

**Consequences**
- Pas de dependance d'images/sprites.
- Couleurs joueurs attribuees par index trie des player IDs (coherent entre tours).

---

## 16. Detection d'elimination du joueur (Sprint 6)

**Contexte**
Un joueur est elimine quand il n'a plus de vaisseaux. Il doit etre informe et ne plus pouvoir agir, mais peut continuer a observer la partie.

**Decision**
- Detection via `ships.filter(s => s.player_id === currentUserId).length === 0`
- Bandeau rouge "Vous avez ete elimine" affiche dans le GameScreen
- Variable `isEliminated` integree dans `canAct` pour desactiver toutes les actions
- Le polling continue pour suivre l'evolution de la partie

**Pourquoi ?**
- Detection cote client suffisante car l'etat `ships` est fourni par le serveur
- Pas besoin d'un flag serveur supplementaire

**Consequences**
- Le joueur elimine ne peut ni deplacer, ni attaquer, ni acheter
- Le bouton boutique et les actions sont masques

---

## 17. Ecran de fin de partie avec stats serveur (Sprint 6)

**Contexte**
Quand `status` passe a `finished`, tous les joueurs doivent voir les resultats.

**Decision**
- Navigation automatique vers `GameOverScreen` quand `status === 'finished'`
- Appel `GET /game-sessions/{id}/stats` pour recuperer le classement et le gagnant
- Ecran affichant : victoire/defaite, gagnant, classement, stats par joueur
- Bouton "Retour au lobby" qui nettoie le GameContext

**Pourquoi ?**
- L'endpoint `/stats` fournit les donnees de classement cote serveur
- Navigation automatique evite au joueur de devoir manuellement quitter

**Consequences**
- Le GameNavigator devient un Stack (GameMain + GameOver)
- Le GameContext est nettoye au retour au lobby

---

## 18. Modification du profil via PUT /profile (Sprint 6)

**Contexte**
Le joueur doit pouvoir modifier son nom, email et mot de passe.

**Decision**
- Mode affichage/edition toggle dans le meme ProfileScreen (pas de nouvel ecran)
- Appel `PUT /profile` avec seulement les champs modifies
- Validation locale (champs vides, mots de passe non concordants, longueur min)
- Mise a jour du AuthContext apres succes

**Pourquoi ?**
- Un seul ecran evite la navigation supplementaire
- Envoyer uniquement les champs modifies respecte le principe de moindre privilege

**Consequences**
- Le mot de passe est optionnel (vide = pas de changement)
- Les erreurs serveur (email deja pris) sont affichees via toast

---

## 19. Historique des parties (Sprint 6)

**Contexte**
Le joueur doit pouvoir consulter ses parties passees avec les resultats.

**Decision**
- Ecran `GameHistoryScreen` accessible depuis le ProfileScreen
- Appel `GET /game-sessions/history` avec pagination
- Tap sur une partie → detail inline (expand) avec appel `GET /game-sessions/{id}/stats`
- FlatList avec chargement progressif (onEndReached)

**Pourquoi ?**
- Detail inline plutot que navigation vers un nouvel ecran : plus fluide, moins de navigation
- Pagination evite de charger tout l'historique d'un coup

**Consequences**
- Le ProfileNavigator devient un Stack (ProfileMain + GameHistory)
- Les stats ne sont chargees qu'a la demande (tap sur une entree)

---

## 20. Correction endpoint /ship-types (Sprint 5 fix)

**Contexte**
L'endpoint des types de vaisseaux etait code `/ships/types` mais l'API expose `/ship-types`.

**Decision**
- Correction de l'URL dans `gameService.ts`

**Pourquoi ?**
- Verification de la documentation Swagger de l'API

**Consequences**
- Les types de vaisseaux sont correctement charges dans le ShipShop

---

*Derniere mise a jour : 05 avril 2026*
