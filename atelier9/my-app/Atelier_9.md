Atelier 9 — Implémentation du pattern de
navigation d'authentiﬁcation

Durée estimée : 1 heure

🎯 Objectifs

Dans cet atelier, vous allez implémenter un pattern de navigation d'authentiﬁcation dans une

application React Native avec Expo Router.

Pratiquer la Context API

Gérer le state avec Context API

Utiliser Expo Router pour la navigation

Manipuler l'API splashscreens d'Expo

À la ﬁn de l’atelier, vous aurez réalisé :

Un contexte de session pour gérer l’état d’authentiﬁcation

Un splashscreen pendant le chargement de la session

Une navigation conditionnelle (routes protégées) selon l’état de la session

Une logique ﬁctive de connexion/déconnexion pour tester la navigation

Étape 1 — Création du contexte SessionContext

Objectifs

Mettre en place un contexte pour gérer l’état de la session (authentiﬁé ou invité)

Comment réaliser cette étape ?

1. Créer un contexte SessionContext avec React.

2. Déﬁnir les valeurs et méthodes nécessaires (ex : login, logout, isLoading, session).

3. Fournir ce contexte à l’ensemble de l’application.

Respectez les bonnes pratiques de structuration et d’organisation du contexte vue en cours et lors

des ateliers précédents. Vous pouvez créer un dossier  contexts/SessionContext  pour y placer : -

un ﬁchier contexte, - un ﬁchier provider, - un ﬁchier de hook personnalisé  useSession  pour

consommer le contexte

Attendus

Un contexte fonctionnel permettant de gérer l’état de session.

Étape 2 — Splashscreen pendant le chargement de la
session

Objectifs

Aﬃcher un splashscreen lors du chargement initial de la session.

Comment réaliser cette étape ?

1. Utiliser l’API splashscreens d’Expo pour aﬃcher/masquer le splashscreen.

2. Gérer le chargement de la session tant que  isLoading  contient  true .

3. Masquer le splashscreen une fois que la session est prête.

Attendus

Splashscreen visible pendant le chargement, masqué une fois la session prête.

Étape 3 — Navigation Stack en fonction de l’état de la
session

Objectifs

Mettre en place une navigation conditionnelle selon l’état de la session.

Comment réaliser cette étape ?

1. Utiliser Expo Router pour déﬁnir une navigation Stack.

2. Protéger les routes :

Invité : accès à Login et Register

Authentiﬁé : accès à Home et Proﬁle (Tabs)

3. Adapter le layout et les slots selon l’état de la session.

Vous devrez créer des vues simples à cette étape pour les diﬀérentes routes (Login, Register, Home,

Proﬁle).

Attendus

Navigation conditionnelle fonctionnelle selon l’état de session.

Étape 4 — Logique de connexion/déconnexion ﬁctive

Objectifs

Permettre de tester la navigation conditionnelle via une logique ﬁctive.

Comment réaliser cette étape ?

1. Implémenter des méthodes ﬁctives de login/logout dans le contexte agissant sur la valeur de

 session . Lorsque l'utilisateur est connecté,  session  doit contenir un objet utilisateur "en dur",

et lorsqu'il est déconnecté,  session  doit contenir la valeur  null .

2. Mettre à jour l’état de session lors des actions.

3. Vériﬁer le comportement de la navigation.

Attendus

Possibilité de se connecter/déconnecter pour tester la navigation.

Fin de l’atelier

🎉  Félicitations ! Vous avez implémenté un pattern de navigation d’authentiﬁcation avec Expo Router
et Context API.

