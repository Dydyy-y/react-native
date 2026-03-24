# BMAD - Sprint Planning Documentation

Bienvenue dans la documentation complète du sprint **Space Conquest Online**.

---

## 📍 Vous êtes ici

Dossier : `projet/_bmad/`  
Affaire : Sprint 1 - Planification complète  
Date : 23 mars 2026  
Status : ✅ COMPLÉTÉ

---

## 🎯 Commencer Par

### Option 1 : Je suis très occupé (5 min)
1. Lisez [SUMMARY.md](SUMMARY.md) (ce document donne un aperçu complet)

### Option 2 : Je suis un Developer (45 min)  
1. [QUICKSTART.md](QUICKSTART.md) - Setup en 30 min + tips
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Sections 1-5 uniquement
3. Commencez le coding !

### Option 3 : Je suis un Product Manager (60 min)
1. [INDEX.md](INDEX.md) - Navigation + contexte
2. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Timeline + backlog
3. [SUMMARY.md](SUMMARY.md) - Résumé final

### Option 4 : Je veux TOUT comprendre (2-3 heures)
1. [INDEX.md](INDEX.md) - Vue d'ensemble
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Design système complet
3. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Timeline + resources
4. [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) - First epic details
5. [PRD_EPIC2_LOBBY.md](PRD_EPIC2_LOBBY.md) - Second epic details
6. [PRD_EPIC3_MODERATION.md](PRD_EPIC3_MODERATION.md) - Third epic details
7. [PRD_EPIC4_GAME.md](PRD_EPIC4_GAME.md) - Fourth epic details
8. [SUMMARY.md](SUMMARY.md) - Recap everything

---

## 📂 Fichiers dans ce Dossier

| Fichier | Lignes | Audience | Temps | Type |
|---------|--------|----------|-------|------|
| [SUMMARY.md](SUMMARY.md) | 300 | Everyone | 15min | Overview |
| [INDEX.md](INDEX.md) | 320 | Everyone | 20min | Navigation |
| [QUICKSTART.md](QUICKSTART.md) | 250 | Developer | 30min | Setup guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 375 | Developer + PM | 45min | Design docs |
| [SPRINT_PLANNING.md](SPRINT_PLANNING.md) | 300 | PM + Developer | 40min | Timeline |
| [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) | 280 | Developer | 30min | Specs |
| [PRD_EPIC2_LOBBY.md](PRD_EPIC2_LOBBY.md) | 340 | Developer | 35min | Specs |
| [PRD_EPIC3_MODERATION.md](PRD_EPIC3_MODERATION.md) | 240 | Developer | 25min | Specs |
| [PRD_EPIC4_GAME.md](PRD_EPIC4_GAME.md) | 320 | Developer | 35min | Specs |

**TOTAL: 2,400+ lignes de specs + architecture**

---

## 🗺️ Mapa Mental des Contenus

```
SPRINT_PLANNING (Exécutive)
    ├─→ ARCHITECTURE (Design)
    │       ├─→ PRD_EPIC1 (Auth specs)
    │       ├─→ PRD_EPIC2 (Lobby specs)
    │       ├─→ PRD_EPIC3 (Moderation specs)
    │       └─→ PRD_EPIC4 (Game specs)
    │
    └─→ QUICKSTART (Dev setup)
            └─→ Commencer à coder

INDEX (Navigation)
    └─→ FAQ + Glossaire + References
```

---

## 💡 Guide Rapide par Rôle

### Je suis Developer
```
1. Lire QUICKSTART.md (30 min)
   → Vous apprenez comment setup le projet

2. Lire ARCHITECTURE.md sections 1-5 (20 min)
   → Vous apprenez la structure et les patterns

3. Lire PRD_EPIC1_AUTH.md section 4 (15 min)
   → Technical details pour commencer

4. Coder pendant 3-4 jours
   → Implémentez Épic 1

5. Répéter pour Épic 2, 3, 4
```

### Je suis Product Manager
```
1. Lire SUMMARY.md (15 min)
   → Aperçu complet

2. Lire SPRINT_PLANNING.md (40 min)
   → Timeline + backlog + risks

3. Lire sections "Objective Business" dans chaque PRD (15 min)
   → Comprendre la valeur business de chaque feature

4. Valider avec le team
   → Tout est approuvé ?
```

### Je suis QA / Test Engineer
```
1. Lire INDEX.md (15 min)
   → Navigation + glossaire

2. Copier tous les tableaux "Acceptance Tests" de chaque PRD
   → Créez votre test plan

3. Attendre que dev finisse Épic 1
   → Commencer testing manuel

4. Tester tous les scenarios dans l'ordre
```

---

## ✅ Validation Checklist

Vous pouvez commencer le code si vous avez :

- [ ] Lu le document approprié pour votre rôle
- [ ] Compris les 4 épiques et leurs dépendances
- [ ] Noté les constraints API (20 req/min, 30s polling)
- [ ] Identifié les 4 Contexts principaux
- [ ] Vu le folder structure dans ARCHITECTURE.md
- [ ] Noté les endpoints API pour Épic 1
- [ ] Compris les User Stories d'Épic 1

---

## 🚀 Next Actions

### Immédiate (Maintenant)
- [ ] Lisez le document pour votre rôle
- [ ] Posez des questions si besoin

### Court terme (Demain)
- [ ] **Developer** : Setup Expo project
- [ ] **PM** : Validate scope with team
- [ ] **QA** : Créez test plan

### Moyen terme (Cette semaine)
- [ ] **Developer** : Implémentez Épic 1 (Auth)
- [ ] **PM** : Review Épic 1 code
- [ ] **QA** : Testez Épic 1

---

## 📊 Sprint Estimation

- **Durée totale** : 4 semaines (23 mar - 7 avr 2026)
- **Effort total** : 60 story points
- **Épics** : 4 (Auth → Lobby → Moderation → Game)
- **User Stories** : 13
- **Acceptance Tests** : 50+

---

## 🔐 Security & Compliance

Tous les PRDs incluent :
- ✅ Secure token storage
- ✅ Auth header handling
- ✅ 401/403 error scenarios
- ✅ Data validation strategies
- ✅ Error handling patterns

---

## 📞 Questions Fréquentes

**Q: Par où commencer ?**  
A: Dépend de votre rôle - voir "Guide Rapide par Rôle" ci-dessus.

**Q: Combien de temps pour tout lire ?**  
A: 30 min (Developer) à 2 heures (Complete read).

**Q: Est-ce que je dois lire TOUS les PRDs maintenant ?**  
A: Non. Lisez ARCHITECTURE.md + PRD_EPIC1 pour commencer. Les autres viendront après Épic 1.

**Q: Où faut-il coder ?**  
A: Voir QUICKSTART.md de la structure exacte du projet.

**Q: Qui approuve les changes ?**  
A: Code review avec les acceptance tests du PRD.

---

## 📚 Ressources Externes

- **API Docs** : https://space-conquest-online.osc-fr1.scalingo.io/api/documentation
- **React Native** : https://reactnative.dev/
- **Expo** : https://docs.expo.dev/
- **React Navigation** : https://reactnavigation.org/
- **TypeScript** : https://www.typescriptlang.org/

---

## 🎓 Termes Utilisés

- **Epic** : Grande feature (plusieurs user stories)
- **User Story** : Fonctionnalité spécifique pour un utilisateur
- **Acceptance Criteria** : Conditions de succès mesurables
- **Sprint** : Itération de travail (4 semaines ici)
- **Context** : React Context pour état global
- **Reducer** : Pattern pour gérer état complexe
- **Polling** : Requêtes HTTP périodiques (30s ici)

Voir [INDEX.md](INDEX.md) section "Glossaire" pour plus.

---

## 🏁 PRÊT À COMMENCER ?

Sélectionnez votre document d'entrée en haut de ce page et commencez ! 🚀

---

**Documentation créée le 23 mars 2026**  
**Status : ✅ COMPLETE - READY FOR DEVELOPMENT**

