Atelier 8 — Structurer l’état d’une
application avec Context API et Reducers

Durée estimée : 2 heures

🎯 Objectifs

Dans cet atelier, vous allez réaliser une application React Native de gestion de panier pour une

boutique ﬁctive. L’application doit permettre :

D’aﬃcher une liste de produits

D’ajouter ou retirer des produits du panier (contexte avec reducer)

De gérer le thème (sombre/clair) via un contexte dédié

D’aﬃcher des notiﬁcations (ex : conﬁrmation d’ajout au panier) via un contexte

L’objectif est de structurer l’état de l’application en créant plusieurs contextes : un pour le panier

(avec reducer), un pour le thème, un pour les notiﬁcations. Chaque contexte doit être isolé et utilisé

selon les bonnes pratiques.

⚠  Pour cet atelier, vous devez réutiliser le code de l'atelier 6 bis ou récupérer celui de la

correction.

À la ﬁn de l’atelier, vous aurez :

Une application React Native avec plusieurs contextes pour diﬀérentes parties de l’état

Un contexte utilisant un reducer pour gérer le panier

Un contexte pour le thème

Un contexte pour les notiﬁcations

Des composants consommant ces contextes pour aﬃcher et manipuler l’état

Étape 1 — Architecture des contextes

Objectifs

Concevoir la structure des contextes

Comment réaliser cette étape ?

1. Déterminer quelles parties de l’état seront gérées par des contextes

2. Décider quels contextes utiliseront un reducer

3. Préparer un schéma ou une description de l’architecture des contextes

Attendus

Une architecture avec au moins deux contextes

Un contexte utilisant un reducer

Étape 2 — Implémentation des contextes

Objectifs

Créer les contextes et leur logique

Comment réaliser cette étape ?

1. Implémenter les contextes dans des ﬁchiers séparés

2. Pour le contexte avec reducer : déﬁnir le reducer, les actions et le provider

3. Pour les autres contextes : déﬁnir le provider et la logique associée

4. Fournir les contextes à l’application via le composant racine

Attendus

Des ﬁchiers de contexte fonctionnels

Un reducer opérationnel dans au moins un contexte

Étape 3 — Utilisation des contextes dans l’application

Objectifs

Consommer les contextes dans les composants

Comment réaliser cette étape ?

1. Utiliser les hooks de contexte dans les composants pour accéder à l’état et aux actions

2. Mettre à jour l’état via les contextes

3. Aﬃcher et manipuler les données selon le périmètre déﬁni

Durant cette étape, vous devrez créer les composants manquants dans l'application comme ceux de

la gestion du panier.

Attendus

Composants utilisant les contextes pour lire et modiﬁer l’état

Fin de l’atelier

🎉  Félicitations ! Vous avez structuré une application React Native avec plusieurs contextes, dont un

utilisant un reducer, selon les bonnes pratiques de gestion d’état.

