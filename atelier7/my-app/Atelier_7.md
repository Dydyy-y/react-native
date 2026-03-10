Atelier 7 — Navigation avec Expo Router

Durée estimée : 1 heure

🎯 Objectifs

Dans cet atelier, vous allez concevoir une application React Native utilisant Expo Router pour

explorer la navigation multi-niveaux.

À la ﬁn de l’atelier, vous aurez réalisé :

📝 Sujet

Vous allez réaliser une application bancaire mobile permettant la gestion des comptes, virements,

cartes et opérations courantes. L'objectif est de structurer l'application autour d'une navigation multi-

niveaux, en mettant l'accent sur l'expérience utilisateur.

La logique métier peut rester simple (données statiques ou mockées), aucun appel API ni gestion

réelle des données.

La connexion doit être proposée à la racine de l'application (formulaire simple, gestion en dur, sans

contexte ni authentiﬁcation réelle). Les formulaires n'envoient aucune donnée.

Étape 1 — Cahier des charges & structure du projet

Objectifs

Comprendre les exigences fonctionnelles de l’application

Déﬁnir la structure de navigation (Tabs, Stack, Layouts)

Comment réaliser cette étape ?

Concevoir sur papier ou mentalement la structure de l’application, en identiﬁant les diﬀérentes vues

et leur organisation en Tabs et Stack d'après le cahier des charges suivant :

1. L'application démarre sur une page de connexion (formulaire simple, validation en dur).

2. Après connexion, l'utilisateur accède à une interface principale organisée en Tabs :

Comptes (liste des comptes, détails)

Virements (initier un virement, historique)

Cartes (gestion des cartes, blocage, demande)

Proﬁl (informations utilisateur)

3. Chaque Tab doit contenir une navigation Stack pour accéder aux détails ou eﬀectuer des actions

:

Comptes : Vue générale, Détail d’un compte

Virements : Page menu, Formulaire de virement, historique détaillé, liste des bénéﬁciaires

Cartes : Vue générale, Détail d’une carte, formulaire d'opposition, formulaire de demande

Proﬁl : Détail du proﬁl, paramètres

4. Les données sont statiques ou mockées, aucun appel API.

5. Utilisez le composant Link ou le hook useRouter pour naviguer entre les vues si nécessaire.

6. La navigation doit être claire et cohérente.

Attendus

Structure de navigation claire et fonctionnelle

Respect du cahier des charges

Étape 2 — Mise en place des layouts et routes

Objectifs

Implémenter la navigation Tabs et Stack avec Expo Router

Créer les layouts correspondants

Comment réaliser cette étape ?

Créez les ﬁchiers de routes et les layouts nécessaires pour structurer l’application selon la navigation

déﬁnie à l’étape précédente. Assurez-vous que les Tabs et Stack sont correctement conﬁgurés pour

permettre une navigation ﬂuide entre les diﬀérentes sections de l’application.

Attendus

Layouts Tabs et Stack opérationnels

Navigation multi-niveaux fonctionnelle

Étape 3 — Ajout des pages et navigation interne

Objectifs

Ajouter des pages à chaque niveau de navigation

Utiliser Link et useRouter pour naviguer entre les pages

Comment réaliser cette étape ?

Créez les diﬀérentes pages pour chaque section de l’application (Comptes, Virements, Cartes, Proﬁl).

Ajoutez un contenu minimal pour chaque page (texte, boutons) et utilisez le composant Link ou le

hook useRouter pour permettre la navigation entre les pages si nécessaire, en respectant la logique

déﬁnie dans le cahier des charges.

Attendus

Pages accessibles via la navigation

Utilisation pertinente de Link et useRouter

Étape 4 — Personnalisation du style

Objectifs

Appliquer un style cohérent à l’application

Personnaliser les layouts et pages

Comment réaliser cette étape ?

Ajoutez du style aux layouts et pages (utilisez StyleSheet).Assurez-vous que la navigation reste claire

et lisible.

Attendus

Application stylée et agréable à utiliser

Navigation visuelle cohérente

Fin de l’atelier

🎉  Félicitations ! Vous avez conçu une application React Native avec une navigation avancée grâce à

Expo Router, en combinant Tabs, Stack, layouts personnalisés et diﬀérents modes de navigation.

