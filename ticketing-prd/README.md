### Billetterie QR — PRD et documentation

Ce dépôt contient le PRD et la documentation de référence pour une application de génération de billets d’événement avec QR Code, personnalisation de template (prénom, nom, email, identité visuelle), et un back‑office de scan le jour J (mode en ligne et hors ligne).

### Portée

- Génération de billets uniques avec QR Code signé
- Personnalisation visuelle (templates) et envoi email
- Back‑office de scan (PWA mobile) avec anti‑fraude et synchronisation
- Administration des événements, quotas et rapports

### Stack cible (standards 2025)

- Frontend: Next.js 15, React 19, TypeScript 5.x
- Backend: Next.js (App Router, API Routes/Server Actions), Node.js 22 LTS
- Base de données: PostgreSQL (via Prisma ORM)
- Files/queues: background jobs pour emailing et génération PDF
- Mobile scan: PWA (Camera + Barcode Detection API, fallback ZXing/jsQR)

Consultez l’index pour la vue d’ensemble: `docs/00-INDEX.md`.

### Navigation rapide

- PRD produit: `docs/01-PRD.md`
- Architecture: `docs/02-ARCHITECTURE.md`
- Modèle de données: `docs/03-DATA-MODEL.md`
- API: `docs/04-API.md`
- Sécurité & QR signé: `docs/05-SECURITE-QR.md`
- Scanner & back‑office: `docs/06-SCANNER-BO.md`
- Templates, PDF & Wallet: `docs/07-TEMPLATES-PDF-WALLET.md`
- CI/CD: `docs/08-CICD.md`
- RGPD: `docs/09-RGPD.md`
- Tests & QA: `docs/10-TESTS-QA.md`
- Roadmap: `docs/11-ROADMAP.md`

