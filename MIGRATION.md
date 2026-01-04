# CVBuilder v2 Migration

## Vue d'ensemble

Migration du CVBuilder de la stack actuelle vers une stack moderne :

| Avant | Après |
|-------|-------|
| JavaScript | TypeScript |
| Material UI | Shadcn/UI + Tailwind |
| MongoDB + Mongoose | Supabase + PostgreSQL |
| useEffect pour data fetching | TanStack Query |
| API Routes (Pages Router) | Supabase Client direct |

## Principes directeurs

### 1. Éviter useEffect autant que possible
- **Data fetching** : TanStack Query (`useQuery`, `useMutation`)
- **Formulaires** : React Hook Form (`watch`, `setValue`, subscriptions)
- **Derived state** : `useMemo` ou calcul direct dans le render
- **State sync** : Zustand avec selectors optimisés

### 2. Stack technique finale
| Outil | Rôle |
|-------|------|
| TypeScript | Typage strict du code |
| Zustand | State UI local (étapes, navigation) |
| React Hook Form + Zod | Formulaires et validation |
| TanStack Query | Data fetching, cache, mutations Supabase |
| Shadcn/UI + Tailwind | Composants UI |
| Supabase | Database PostgreSQL + Auth optionnelle |

## Progression

### Phase 0 : Préparation
- [x] Création branche v2-migration
- [x] Configuration .gitignore pour Supabase
- [ ] Configuration TypeScript
- [ ] Installation TanStack Query

### Phase 1 : Infrastructure Supabase
- [ ] Création projet Supabase (eu-west-1)
- [ ] Schema PostgreSQL (hybride JSONB + tables)
- [ ] Configuration auth optionnelle (guest + inscription)

### Phase 2 : Shadcn/UI
- [ ] Installation et configuration
- [ ] Adaptation du thème (couleurs actuelles)

### Phase 3 : Migration Composants
- [ ] Types et Utils
- [ ] Store Zustand
- [ ] Common (NavBar, Footer)
- [ ] LandingPage
- [ ] Formulaires cvgen
- [ ] CVEdit

### Phase 4 : Migration API
- [ ] Services Supabase
- [ ] Hooks TanStack Query
- [ ] Suppression API Routes

### Phase 5 : Finalisation
- [ ] Cleanup dépendances MUI
- [ ] Tests complets
- [ ] Documentation

## Notes de migration

### Fichiers à supprimer à la fin
- `app/theme.js` (remplacé par Tailwind config)
- `lib/dbConnect.js` (MongoDB)
- `models/CV.js` (Mongoose)
- `pages/api/**/*` (API Routes)

### Dépendances à supprimer
```bash
npm uninstall @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled mongoose mongoose-field-encryption
```

### Dépendances à ajouter
```bash
npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query
npm install -D typescript @types/react @types/react-dom @types/node
```

