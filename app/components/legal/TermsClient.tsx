// app/components/legal/TermsClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

interface TermsClientProps {
  locale?: string;
}

const TermsClient = ({ locale }: TermsClientProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <NavBar />
      <main className="container max-w-3xl mx-auto px-4 py-8 mt-20 mb-8 text-foreground">
        <h1 className="text-3xl font-serif font-bold mb-4">
          Conditions Générales d'Utilisation
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Date de dernière mise à jour : 01/10/2024
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
          <p className="text-base leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir
            les conditions dans lesquelles GEDS LDA (ci-après « Nous ») met à disposition des utilisateurs
            (ci-après « Vous ») un service en ligne permettant la création, l'édition, la personnalisation, 
            et la génération de CV au format PDF (ci-après « le Service »). L'utilisation du Service implique 
            l'acceptation pleine et entière des présentes CGU.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Description du Service</h2>
          <p className="text-base leading-relaxed mb-4">
            Le Service propose :
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>La création, l'édition et la mise en forme d'un CV unique par utilisateur, 
            à partir des données que Vous fournissez manuellement.</li>
            <li>La possibilité de télécharger le CV au format PDF.</li>
            <li>Le Service est accessible sans obligation de souscription ni authentification, 
            mais Vous devez accepter les CGU et la Politique de Protection des Données avant de commencer 
            la création d'un CV.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Accès au Service</h2>
          <p className="text-base leading-relaxed">
            Le Service est accessible depuis l'Union européenne. Nous ne garantissons pas un accès 
            ininterrompu ou sans erreur. Nous pouvons suspendre, restreindre ou modifier le Service à tout moment, 
            sans obligation de notification préalable, notamment pour des raisons techniques, légales ou de maintenance.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Responsabilités de l'Utilisateur</h2>
          <p className="text-base leading-relaxed mb-4">
            Vous êtes seul responsable du contenu que Vous saisissez dans le Service. Vous vous engagez à :
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Ne fournir que des informations exactes, pertinentes et licites.</li>
            <li>Respecter les droits des tiers, notamment en matière de propriété intellectuelle.</li>
            <li>Ne pas introduire de contenus illicites, diffamatoires, discriminatoires, obscènes, trompeurs, 
            ou portant atteinte à la vie privée d'autrui.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Limitation de Responsabilité de GEDS LDA</h2>
          <p className="text-base leading-relaxed">
            Nous mettons en œuvre les moyens raisonnables pour assurer le bon fonctionnement du Service, 
            mais Nous ne garantissons pas l'adéquation du Service à un besoin particulier, ni l'absence de bugs ou d'erreurs. 
            Nous ne pouvons être tenus responsables des dommages directs, indirects, ou immatériels résultant de l'utilisation 
            ou de l'impossibilité d'utiliser le Service, y compris en cas de perte de données ou d'interruption du Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Propriété Intellectuelle</h2>
          <p className="text-base leading-relaxed">
            La structure, la mise en page, les modèles de CV, les éléments graphiques, ainsi que l'ensemble des contenus 
            et éléments de propriété intellectuelle du Service (hors contenus fournis par Vous) restent la propriété exclusive 
            de GEDS LDA. Vous conservez la propriété intellectuelle des données que Vous saisissez. En utilisant le Service, 
            Vous bénéficiez d'une licence non-exclusive et personnelle pour la génération de votre CV. Toute reproduction, 
            modification, distribution ou exploitation non autorisée des contenus du Service est interdite.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Données Personnelles</h2>
          <p className="text-base leading-relaxed">
            L'utilisation du Service implique la collecte, le traitement et la conservation de certaines données personnelles, 
            définies dans la Politique de Protection des Données (PPD). Les conditions du traitement de ces données sont 
            définies dans la PPD, qui fait partie intégrante des présentes CGU. En utilisant le Service, Vous reconnaissez 
            avoir pris connaissance de la PPD et l'accepter.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Modifications des CGU</h2>
          <p className="text-base leading-relaxed">
            Nous nous réservons le droit de modifier à tout moment les présentes CGU. La version en vigueur est 
            celle publiée sur le site à la date de Votre utilisation. Il Vous appartient de consulter régulièrement les CGU. 
            L'utilisation du Service après modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Juridiction et Droit Applicable</h2>
          <p className="text-base leading-relaxed">
            Les présentes CGU sont régies par le droit de l'Union européenne et, le cas échéant, par le droit portugais. 
            En cas de litige, les tribunaux compétents seront ceux du ressort de l'entreprise GEDS LDA.
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

export default TermsClient;

