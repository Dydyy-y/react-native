# PRD - Étapes 5bis + 6 : Fin de Partie, Profil et Historique

**Date** : 04 avril 2026  
**Version** : 1.0  
**Status** : A développer  
**Sprint** : 6

---

## 1. Objectif

Gérer l'élimination des joueurs, la fin de partie avec écran de résultats, le profil utilisateur complet (modification) et l'historique des parties.

**Critères de succès** :
- Joueur éliminé informé clairement, peut encore observer
- Fin de partie détectée, écran résultats avec gagnant + stats
- Profil modifiable (nom, email, mot de passe)
- Historique des parties consultable
- Déconnexion fonctionnelle

---

## 2. User Stories

### US 6.1 - Élimination des joueurs (Étape 5bis)

**En tant que** joueur éliminé  
**Je veux** être informé et pouvoir continuer à observer  
**Afin de** suivre la fin de la partie

**Critères d'acceptation** :
- [ ] Détection : le joueur n'a plus de vaisseaux dans la liste `ships` (aucun vaisseau avec son owner_id)
- [ ] Affichage message clair : "Vous avez été éliminé"
- [ ] Le joueur peut encore voir la carte et les infos de la partie
- [ ] Le joueur NE PEUT PLUS effectuer d'actions de jeu (boutons cachés/disabled)
- [ ] Le polling continue pour suivre l'évolution de la partie

---

### US 6.2 - Fin de la partie (Étape 5bis)

**En tant que** joueur  
**Je veux** voir le résultat de la partie quand elle se termine  
**Afin de** connaître le gagnant et mes statistiques

**Critères d'acceptation** :
- [ ] Détection : `status` passe à "finished" dans l'état de jeu (via polling)
- [ ] Redirection vers GameOverScreen pour tous les joueurs
- [ ] Afficher : nom du joueur gagnant
- [ ] Afficher : classement des joueurs
- [ ] Afficher : statistiques de la partie
- [ ] Bouton pour retourner au lobby

---

### US 6.3 - Profil utilisateur (Étape 6)

**En tant qu'** utilisateur  
**Je veux** voir et modifier mes informations  
**Afin de** gérer mon compte

**Critères d'acceptation** :
- [ ] Afficher nom d'utilisateur et email (déjà fait)
- [ ] Interface de modification : champs nom, email, mot de passe
- [ ] Appel API pour mettre à jour le profil (vérifier endpoint dans doc API)
- [ ] Gestion erreurs de validation (email déjà pris, etc.)
- [ ] Succès : toast + mise à jour AuthContext
- [ ] Bouton déconnexion (déjà fait)

---

### US 6.4 - Historique des parties (Étape 6)

**En tant qu'** utilisateur  
**Je veux** voir l'historique de mes parties  
**Afin de** consulter mes résultats passés

**Critères d'acceptation** :
- [ ] Écran accessible depuis le profil ou un onglet
- [ ] Liste des parties jouées (FlatList)
- [ ] Pour chaque partie : nom session, date, résultat
- [ ] Tap sur une partie -> détails (stats, joueurs, classement)
- [ ] Appel API pour récupérer l'historique (vérifier endpoint dans doc API)

---

## 3. Détails Techniques

### Services
- `gameService.getGameResults(gameId)` -> endpoint résultats (vérifier doc API)
- `authService.updateProfile(data)` -> endpoint modification profil (vérifier doc API)
- `authService.getGameHistory()` -> endpoint historique (vérifier doc API)

### API Endpoints (vérifier doc officielle)
- Endpoint résultats de partie
- Endpoint modification profil
- Endpoint historique des parties

---

## 4. Fichiers à Créer/Modifier

```
src/features/game/screens/
└── GameOverScreen.tsx          (écran fin de partie)

src/features/auth/screens/
├── ProfileScreen.tsx           (compléter : modification profil)
└── GameHistoryScreen.tsx       (historique des parties)

src/features/auth/services/
└── authService.ts              (compléter : updateProfile, getGameHistory)
```

---

## 5. Points d'Attention

- **Consigne** : "Le joueur éliminé peut continuer à consulter la carte et les informations de la partie, mais ne peut plus effectuer d'actions de jeu"
- **Consigne** : "Le joueur éliminé doit être informé de son élimination par l'affichage d'un message clair"
- **Consigne** : "Tous les joueurs sont redirigés vers un écran de fin de partie affichant le nom du joueur gagnant, le classement et les statistiques"
- **Consigne** : "L'interface de modification doit permettre de modifier son nom, email et mot de passe"
- **Consigne** : "La déconnexion doit supprimer le token et rediriger vers l'écran de connexion"
