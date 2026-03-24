Atelier 6 bis — Liste de produits avec
recherche

Durée estimée : 2 heures

🎯 Objectifs

Dans cet atelier, vous allez concevoir une application React Native permettant d’aﬃcher une liste de

produits issue de l’API DummyJSON (https://dummyjson.com/docs/products), avec une barre de

recherche et un aﬃchage conditionnel des détails d’un produit.

Pratiquer les requêtes HTTP avec  fetch

Manipuler l’état local et l’aﬃchage conditionnel

Structurer et styliser une interface utilisateur

À la ﬁn de l’atelier, vous aurez réalisé :

Une liste de produits récupérée depuis l’API DummyJSON

Une barre de recherche permettant de ﬁltrer les produits

Un aﬃchage conditionnel des détails d’un produit sélectionné

Une interface stylisée et agréable à utiliser

Étape 1 — Cahier des charges

Objectifs

Comprendre les attentes fonctionnelles et techniques

Comment réaliser cette étape ?

1. Lire attentivement le sujet et les contraintes

2. Identiﬁer les fonctionnalités à implémenter

3. Lister les composants nécessaires

Attendus

Cahier des charges rédigé (liste des fonctionnalités, contraintes, composants)

Étape 2 — Récupération des produits

Objectifs

Mettre en place la récupération des produits via l’API DummyJSON

Comment réaliser cette étape ?

1. Utiliser  fetch  pour récupérer la liste des produits depuis l'API DummyJSON Products en

utilisant la documentation d'API https://dummyjson.com/docs/products

2. Stocker les produits dans un état local

3. Aﬃcher la liste des produits avec leurs informations de base (ex: nom, prix) dans une liste

Attendus

Étape 3 — Pagination et scroll inﬁni

Objectifs

Gérer la pagination des produits avec un scroll inﬁni

Comment réaliser cette étape ?

1. Utiliser les paramètres  limit  et  skip  de l’API DummyJSON pour charger les produits par

page en utilisant la documentation d'API https://dummyjson.com/docs/products#products-

limit_skip

2. Modiﬁer le comportement de la liste, qui doit être une  FlatList  en implémentant le chargement

au scroll avec la propriété  onEndReached  et en déﬁnissant le seuil de déclenchement avec

 onEndReachedThreshold . Consulter la documentation de ces deux props sur la page de

 VirtualizedList  (qui est le composant servant de base à  FlatList ) pour en savoir plus :

https://reactnative.dev/docs/virtualizedlist#onendreached

3. Ajouter les nouveaux produits à la liste existante sans écraser l’état

4. Gérer l’état de chargement et la ﬁn de la liste

Attendus

Les produits se chargent dynamiquement au scroll, jusqu’à épuisement de la liste

Objectifs

Permettre la recherche de produits par nom

Comment réaliser cette étape ?

1. Ajouter un champ de saisie pour la recherche

2. Filtrer la liste des produits selon la saisie

3. Mettre à jour l’aﬃchage en temps réel

Attendus

La liste se ﬁltre dynamiquement selon la recherche

Étape 4 — Aﬃchage des détails

Objectifs

Aﬃcher les détails d’un produit sélectionné

Comment réaliser cette étape ?

1. Ajouter une interaction pour sélectionner un produit (ex: clic)

2. Utiliser un état pour stocker l’id du produit sélectionné

3. Aﬃcher les détails du produit si un id est présent

4. Permettre de revenir à la liste

Attendus

Les détails d’un produit s’aﬃchent de façon conditionnelle

Étape 5 — Style et contraintes UI

Objectifs

Appliquer du style pour une interface claire et agréable

Comment réaliser cette étape ?

1. Utiliser les composants de base et le système de styles

2. Respecter les contraintes suivantes :

Liste lisible et aérée

Barre de recherche bien intégrée

Détails du produit mis en valeur

Responsive et adapté mobile

3. Ajouter des touches personnelles pour améliorer l’UI

Attendus

L’application est agréable à utiliser et respecte les contraintes de style

Fin de l’atelier

🎉  Félicitations ! Vous avez conçu une application React Native complète, connectée à une API, avec

recherche et aﬃchage conditionnel des détails. Vous avez pratiqué la récupération de données, la

gestion d’état et ajouté du style à l'interface.

