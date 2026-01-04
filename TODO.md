# CV Builder - TODO & Roadmap

## 🔴 Priorité Haute (Bugs à corriger)

### Bugs Critiques
- [ ] **Input value null warning** - `EducationForm.tsx` ligne 239 : le prop `value` ne doit pas être null
- [ ] **Error handling vide** - Améliorer la gestion quand un achievement/responsibility est ajouté mais pas rempli
- [ ] **Responsive design** - Vérifier tous les breakpoints (mobile, tablet, desktop)

### Performance
- [ ] Audit des re-renders inutiles avec React DevTools
- [ ] Lazy loading des composants lourds (PDF renderer)
- [ ] Optimiser les images (next/image avec blur placeholder)

## 🟡 Priorité Moyenne (Améliorations)

### Code Quality
- [ ] Ajouter des commentaires JSDoc sur les fonctions principales
- [ ] Créer des tests unitaires (Jest + React Testing Library)
- [ ] Tests E2E avec Playwright
- [ ] Ajouter ESLint rules plus strictes
- [ ] Configurer Husky pour pre-commit hooks

### UX/UI
- [ ] Animation de transition entre les étapes du formulaire
- [ ] Skeleton loaders pendant le chargement
- [ ] Toast notifications pour les actions (sauvegarde, erreurs)
- [ ] Mode sombre (dark mode)
- [ ] Indicateur de progression plus visuel (étapes complétées en vert)

### Accessibilité (a11y)
- [ ] Audit WCAG 2.1 AA
- [ ] Navigation clavier complète
- [ ] Labels ARIA sur tous les éléments interactifs
- [ ] Contraste des couleurs vérifié

## 🟢 Fonctionnalités Futures

### 🔐 Authentification (Optionnelle)

```
┌─────────────────────────────────────────────────────────┐
│                    Mode Invité                          │
│  - Créer un CV sans compte                              │
│  - Données stockées localement (localStorage)           │
│  - Lien unique pour accéder au CV (userId dans URL)     │
│  - Expiration après 30 jours sans accès                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Créer un compte (optionnel)                │
│  - OAuth (Google, LinkedIn, GitHub)                     │
│  - Magic link par email (passwordless)                  │
│  - Associer le CV invité au compte                      │
│  - Gérer plusieurs CV                                   │
└─────────────────────────────────────────────────────────┘
```

- [ ] **Mode Invité amélioré**
  - QR code pour accéder au CV depuis mobile
  - Partage par lien (lecture seule)
  - Export du lien par email

- [ ] **Authentification légère**
  - NextAuth.js avec providers OAuth
  - Magic link (email sans mot de passe)
  - Session persistante

### 📄 Templates de CV

- [ ] **Templates multiples**
  - Classic (actuel)
  - Modern (2 colonnes)
  - Creative (design original)
  - ATS-friendly (optimisé pour les robots RH)
  - Academic (pour chercheurs/doctorants)

- [ ] **Personnalisation**
  - Choix des couleurs (accent, texte, fond)
  - Polices personnalisables
  - Ordre des sections modifiable (drag & drop)
  - Sections optionnelles (certifications, projets, publications)

### 🌍 Internationalisation

- [ ] **Langues supplémentaires**
  - Espagnol
  - Allemand
  - Italien
  - Portugais
  - Arabe (RTL support)

- [ ] **Localisation du contenu**
  - Formats de date par pays
  - Conventions de CV par pays (photo, âge, etc.)

### 📊 Fonctionnalités Avancées

- [ ] **Import de données**
  - Import depuis LinkedIn (scraping ou API)
  - Import depuis un CV PDF existant (OCR)
  - Import depuis JSON/XML

- [ ] **Export multi-format**
  - PDF (actuel)
  - DOCX (Microsoft Word)
  - HTML (portfolio web)
  - JSON (données brutes)

- [ ] **IA & Suggestions**
  - Suggestions de compétences basées sur le poste
  - Amélioration automatique des descriptions
  - Détection des fautes d'orthographe
  - Score de qualité du CV avec conseils

- [ ] **Lettre de motivation**
  - Générateur de lettre basé sur le CV
  - Templates de lettres
  - Personnalisation par offre d'emploi

### 📈 Analytics & Insights

- [ ] **Dashboard utilisateur**
  - Nombre de vues du CV (si partagé)
  - Statistiques de téléchargement
  - Historique des modifications

- [ ] **Admin Dashboard**
  - Nombre de CV créés
  - Taux de complétion
  - Erreurs les plus fréquentes
  - Métriques de performance

### 🔗 Intégrations

- [ ] **Job Boards**
  - Indeed
  - LinkedIn Jobs
  - Welcome to the Jungle
  - Candidature en 1 clic

- [ ] **Portfolio**
  - Page publique personnalisable
  - Sous-domaine personnalisé (nom.cveuro.com)
  - SEO optimisé

- [ ] **ATS Compatibility Check**
  - Analyse de compatibilité ATS
  - Suggestions d'amélioration
  - Score de lisibilité

### 🛡️ Sécurité & Conformité

- [ ] **RGPD**
  - Export des données personnelles
  - Suppression complète du compte
  - Consentement explicite pour les cookies
  - Politique de rétention des données

- [ ] **Sécurité**
  - Rate limiting sur les API
  - Validation côté serveur renforcée
  - Chiffrement des données sensibles
  - Audit de sécurité

## 📝 Notes Techniques

### Stack Actuelle
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn UI
- **State**: Zustand (persist localStorage)
- **Forms**: React Hook Form + Zod
- **PDF**: @alexandernanberg/react-pdf-renderer
- **i18n**: next-intl
- **DB**: MongoDB (via API routes)

### Architecture Suggérée pour Auth
```
/app
  /api
    /auth
      /[...nextauth]/route.ts  # NextAuth.js
    /user
      /route.ts                 # CRUD utilisateur
      /cv/route.ts              # CV par utilisateur
```

### Migrations à Prévoir
1. Ajouter table `users` dans MongoDB
2. Lier `cvs` à `users` (relation optionnelle)
3. Ajouter champ `isGuest` sur les CV
4. Cron job pour nettoyer les CV invités expirés

---

*Dernière mise à jour: 4 janvier 2026*

