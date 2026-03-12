Atelier 10 — Ajouter une fonctionnalité de
scan de QR code avec Expo Camera

Durée estimée : 1 heure

🎯 Objectifs

Dans cet atelier, vous allez enrichir l’application réalisée lors de l’atelier 8 en ajoutant une

fonctionnalité de scan de QR code pour la recherche d'un produit.

Pratiquer l’utilisation d’Expo Camera

Implémenter une fonctionnalité de scan de QR code

Gérer la navigation et l’aﬃchage des détails d’un produit scanné

À la ﬁn de l’atelier, vous aurez réalisé :

L’intégration d’Expo Camera dans votre application

Une nouvelle route "Product Scanner" accessible depuis la barre d’onglet (Tabs)

La détection et l’aﬃchage du résultat d’un QR code scanné

La redirection vers la vue détails du produit correspondant

⚠  Pour cet atelier, vous devez réutiliser le code de l'atelier 8 ou récupérer celui de la

correction.

Étape 1 — Installer et conﬁgurer Expo Camera

Objectifs

Préparer l’environnement pour utiliser Expo Camera

Comment réaliser cette étape ?

1. Installer le package Expo Camera dans votre projet

2. Conﬁgurer les permissions nécessaires pour accéder à la caméra

3. Vériﬁer le fonctionnement de la caméra dans un composant simple

Vous pouvez consulter la documentation oﬃcielle d’Expo Camera pour les instructions d’installation

et de conﬁguration : https://docs.expo.dev/versions/latest/sdk/camera/

Attendus

Expo Camera installé et fonctionnel

Permissions correctement gérées

Étape 2 — Ajouter une nouvelle route "Product
Scanner" dans la barre d’onglet (Tabs)

Objectifs

Intégrer une nouvelle route dédiée au scan de QR code

Comment réaliser cette étape ?

1. Ajouter une route "Product Scanner" dans la barre d’onglet (Tabs) via Expo Router

2. Créer le composant associé à cette route

3. Préparer l’interface pour aﬃcher la caméra et le résultat du scan

Attendus

Nouvelle route "Product Scanner" accessible depuis les Tabs

Interface prête pour le scan

Étape 3 — Implémenter la fonctionnalité de scan de
QR code

Objectifs

Détecter et traiter un QR code

Aﬃcher le résultat scanné

Rediriger vers la vue détails du produit

Comment réaliser cette étape ?

1. Utiliser Expo Camera pour détecter les QR codes et lire leur contenu

2. Récupérer l’id du produit contenu dans le QR code

3. Aﬃcher les informations du produit scanné

4. Rediriger vers la vue détails du produit correspondant

A cette étape, ajoutez également les options que vous jugerez utiles pour améliorer l’expérience

utilisateur, comme la possibilité d'allumer la lampe torche pour faciliter le scan ou de gérer le niveau

de zoom de la caméra.

Pour les tests, vous pouvez utiliser le QRCode ci-dessous contenant l'id 1 :

Vous pouvez également générer vos propres QR codes avec des ids de produits diﬀérents en

utilisant des outils en ligne gratuits.

Attendus

Scan de QR code opérationnel

Aﬃchage du résultat scanné

Redirection vers la vue détails du produit

Fin de l’atelier

🎉  Félicitations ! Vous avez ajouté une fonctionnalité de scan de QR code à votre application, en

utilisant Expo Camera et en intégrant la navigation vers la vue détails du produit scanné.

