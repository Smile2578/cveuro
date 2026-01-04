// app/components/legal/PrivacyClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

interface PrivacyClientProps {
  locale?: string;
}

const PrivacyClient = ({ locale }: PrivacyClientProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <NavBar />
      <main className="container max-w-3xl mx-auto px-4 py-8 mt-20 mb-8 text-foreground">
        <h1 className="text-3xl font-serif font-bold mb-4">
          Politique de Protection des Données
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Date de dernière mise à jour : 01/10/2024
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-base leading-relaxed">
            La présente Politique de Protection des Données (ci-après « PPD ») a pour objet de vous informer 
            sur les modalités de collecte, de traitement et de protection des données personnelles que vous 
            fournissez dans le cadre de l'utilisation du service en ligne proposé par GEDS LDA 
            (ci-après « Nous »). Cette PPD fait partie intégrante des Conditions Générales d'Utilisation (CGU).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Responsable du Traitement</h2>
          <p className="text-base leading-relaxed">
            Le responsable du traitement de vos données personnelles est GEDS LDA, une entreprise portugaise 
            opérant au sein de l'Union européenne.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Données Collectées</h2>
          <p className="text-base leading-relaxed mb-4">
            Le service vous permet de créer, d'éditer et de générer un CV unique, sans authentification. 
            Les données personnelles collectées et traitées sont celles que vous fournissez volontairement 
            via les formulaires du site, notamment :
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Informations personnelles : prénom, nom, email, téléphone, date de naissance, sexe, lieu de naissance, nationalité, adresse, ville, code postal, liens (LinkedIn, site personnel)</li>
            <li>Données de formation : établissement, diplôme, domaine d'études, dates, réalisations</li>
            <li>Données d'expérience professionnelle : entreprise, poste, localisation, dates, responsabilités</li>
            <li>Compétences et langues : niveau, test, score</li>
            <li>Loisirs et hobbies</li>
          </ul>
          <p className="text-base leading-relaxed">
            Des métadonnées techniques (adresses IP, logs serveurs) et des données analytiques fournies par Vercel 
            (hébergement, outils analytiques) peuvent également être collectées automatiquement afin d'assurer 
            la sécurité, la maintenance et l'amélioration du service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Finalités et Bases Légales du Traitement</h2>
          <p className="text-base leading-relaxed mb-4">
            Vos données sont traitées afin de :
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Permettre la création, l'édition et la génération de votre CV (exécution d'un contrat).</li>
            <li>Assurer le bon fonctionnement et l'amélioration continue du service (intérêt légitime).</li>
            <li>Se conformer aux obligations légales et réglementaires, le cas échéant.</li>
          </ul>
          <p className="text-base leading-relaxed">
            L'utilisation du service et l'acceptation des CGU et de la PPD constituent votre consentement préalable 
            au traitement des données. Dans les autres cas, l'intérêt légitime ou l'exécution d'un contrat 
            sert de base légale.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Conservation des Données</h2>
          <p className="text-base leading-relaxed">
            Vos données sont conservées aussi longtemps que nécessaire pour fournir le service et aux fins décrites. 
            Nous nous engageons à effacer les données personnelles sur simple demande envoyée à l'adresse 
            email indiquée ci-dessous, ou lorsque ces données ne sont plus pertinentes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Droits de l'Utilisateur</h2>
          <p className="text-base leading-relaxed mb-4">
            Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Droit d'accès : obtenir la confirmation que vos données sont traitées et une copie de ces données</li>
            <li>Droit de rectification : demander la correction de données inexactes ou incomplètes</li>
            <li>Droit à l'effacement : demander la suppression de vos données</li>
            <li>Droit d'opposition : dans certains cas, vous opposer à un traitement spécifique</li>
            <li>Droit à la limitation : demander la suspension temporaire du traitement dans certains cas</li>
          </ul>
          <p className="text-base leading-relaxed">
            Pour exercer vos droits, veuillez envoyer un email à{' '}
            <a href="mailto:candidatures@geds.fr" className="text-geds-blue hover:underline">
              candidatures@geds.fr
            </a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Sécurité</h2>
          <p className="text-base leading-relaxed">
            Les données sont hébergées dans l'Union européenne (Supabase sur AWS Paris, intégration Vercel). 
            Nous mettons en place des mesures techniques et organisationnelles raisonnables pour protéger 
            vos données contre toute violation, perte, usage malveillant ou accès non autorisé.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Partage de Données et Sous-Traitance</h2>
          <p className="text-base leading-relaxed">
            Vos données ne sont pas vendues à des tiers. Elles peuvent être traitées par nos prestataires techniques 
            (hébergement, analytics Vercel) dans la mesure de leur mission. Ces partenaires sont situés dans l'UE 
            ou disposent de garanties adéquates pour les transferts éventuels de données hors UE.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Cookies et Analyses</h2>
          <p className="text-base leading-relaxed">
            Le service peut utiliser des cookies strictement nécessaires à son bon fonctionnement. Des données 
            analytiques sont collectées par Vercel. Vous ne pouvez pas vous opposer à leur collecte à moins 
            de cesser d'utiliser le service, compte tenu de l'absence d'authentification ou d'options 
            de personnalisation de la vie privée.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Propriété des Contenus</h2>
          <p className="text-base leading-relaxed">
            Le contenu de votre CV vous appartient. Nous ne prétendons à aucun droit de propriété sur les informations 
            que vous saisissez. Toutefois, la structure, les modèles graphiques et les éléments du service 
            restent notre propriété.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. Mise à Jour de la PPD</h2>
          <p className="text-base leading-relaxed">
            Nous pouvons modifier la PPD à tout moment. La version en vigueur est celle publiée sur le site 
            au moment de votre utilisation. Il vous appartient de consulter régulièrement la PPD.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
          <p className="text-base leading-relaxed">
            Pour toute question relative à la protection de vos données, 
            vous pouvez écrire à{' '}
            <a href="mailto:simon@geds.fr" className="text-geds-blue hover:underline">
              simon@geds.fr
            </a>.
          </p>
        </section>

        <div className="mt-8">
          <Link href="/" className="text-geds-blue hover:underline font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyClient;

