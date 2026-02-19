# Plan Claude Code — CARI Dashboard: de statique à live

## CONTEXTE DU PROJET

**Repo:** `caridashboard` (Vite + React, déployé sur caridashboard.netlify.app)
**État actuel:** Dashboard statique avec données hardcodées (15 551 visites, mai 2025 – fév 2026)
**Stack:** Vite 7, React 19, Recharts 3, Lucide React, déployé Netlify
**Fichier principal:** `cari-dashboard.jsx` (~2 130 lignes, tout dans un fichier)

**Objectif:** Transformer ce dashboard en système live avec:
1. Une base de données Supabase (PostgreSQL)
2. Un formulaire de saisie pour le personnel d'accueil (tablette)
3. Le dashboard existant connecté en lecture à Supabase
4. Le tout structuré pour migration future vers Odoo

---

## PHASE 0 — SETUP SUPABASE

### 0.1 Installer Supabase

```bash
npm install @supabase/supabase-js
```

### 0.2 Créer le fichier de config Supabase

Créer `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Créer `.env.local` (gitignored):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx
```

Les variables d'environnement seront aussi configurées dans Netlify.

### 0.3 Schéma SQL Supabase

Exécuter dans le SQL Editor de Supabase. Ce schéma est conçu pour mapper directement vers Odoo CRM (res.partner, crm.lead).

```sql
-- ═══════════════════════════════════════════════════════
-- TABLE: services (référence, rarement modifiée)
-- Odoo mapping: crm.stage
-- ═══════════════════════════════════════════════════════
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  ordre INT DEFAULT 0,
  actif BOOLEAN DEFAULT true
);

INSERT INTO services (nom, ordre) VALUES
  ('Accueil et intégration', 1),
  ('Assermentation', 2),
  ('Emploi', 3),
  ('Francisation', 4),
  ('Formation et vie communautaire', 5),
  ('Parents-Jeunesse', 6),
  ('Femmes du Monde', 7),
  ('Espace Hommes', 8),
  ('ICI Santé', 9);

-- ═══════════════════════════════════════════════════════
-- TABLE: sous_services (détail Aminata — PASI + hors PASI)
-- Odoo mapping: crm.tag
-- ═══════════════════════════════════════════════════════
CREATE TABLE sous_services (
  id SERIAL PRIMARY KEY,
  service_id INT REFERENCES services(id),
  nom TEXT NOT NULL,
  categorie TEXT, -- 'installation', 'post-installation', 'immigration', 'immigration-da', 'divers', 'sante', 'assermentation'
  pasi BOOLEAN DEFAULT true, -- dans l'entente PASI ou non
  actif BOOLEAN DEFAULT true
);

-- Services d'installation PASI (Accueil)
INSERT INTO sous_services (service_id, nom, categorie, pasi) VALUES
  (1, 'Carte d''assurance maladie (RAMQ)', 'installation', true),
  (1, 'Numéro d''assurance sociale (NAS)', 'installation', true),
  (1, 'Inscription garderie', 'installation', true),
  (1, 'Inscription scolaire', 'installation', true),
  (1, 'Compte bancaire', 'installation', true),
  (1, 'Permis de conduire', 'installation', true),
  (1, 'Recherche de logement', 'installation', true),
  (1, 'Assurance maladie privée', 'installation', true),
  (1, 'Assurance médicaments', 'installation', true),
  (1, 'Médecin de famille', 'installation', true),
  (1, 'Premières démarches d''installation', 'installation', true),
  (1, 'Organisme de régionalisation', 'installation', true),
  -- Post-installation PASI
  (1, 'Renouvellement de documents officiels', 'post-installation', true),
  (1, 'Déménagement et logement', 'post-installation', true),
  (1, 'Connaissance société québécoise', 'post-installation', true),
  (1, 'Soutien social et matériel', 'post-installation', true),
  (1, 'Citoyenneté', 'post-installation', true),
  (1, 'Finances personnelles / allocations', 'post-installation', true),
  (1, 'Éducation des enfants', 'post-installation', true),
  (1, 'Santé', 'post-installation', true),
  (1, 'Réorientation professionnelle / reconnaissance', 'post-installation', true),
  (1, 'Interprétariat et traduction', 'post-installation', true),
  (1, 'Séances d''information', 'post-installation', true),
  (1, 'Médiation interculturelle', 'post-installation', true),
  (1, 'Support psychosocial', 'post-installation', true),
  -- Immigration (tout statut sauf DA)
  (1, 'Demande résidence permanente', 'immigration', true),
  (1, 'Demande CSQ (sélection permanente)', 'immigration', true),
  (1, 'Modification permis d''études', 'immigration', true),
  (1, 'Prolongation séjour étudiant', 'immigration', true),
  (1, 'Prolongation séjour travailleur temporaire', 'immigration', true),
  (1, 'Permis de travail post-diplôme', 'immigration', true),
  (1, 'Carte résident permanent', 'immigration', true),
  -- Immigration hors PASI (tout statut sauf DA)
  (1, 'Titre de voyage', 'immigration', false),
  (1, 'Vérification/remplacement document immigration', 'immigration', false),
  (1, 'Renouvellement carte RP', 'immigration', false),
  (1, 'Évaluation comparative (diplômes)', 'immigration', false),
  (1, 'Parrainage familial', 'immigration', false),
  -- Immigration DA spécifique
  (1, 'Renouvellement permis de travail (DA)', 'immigration-da', false),
  (1, 'Renouvellement document DA', 'immigration-da', false),
  (1, 'Vérification biométriques (DA)', 'immigration-da', false),
  (1, 'Aide sociale (DA)', 'immigration-da', false),
  -- Divers hors PASI
  (1, 'Aide sociale (non-DA)', 'divers', false),
  (1, 'Allocation logement', 'divers', false),
  (1, 'Certificat de naissance', 'divers', false),
  (1, 'Problèmes bail/logement', 'divers', false),
  (1, 'Divorce/séparation', 'divers', false),
  (1, 'Dossier Hydro-Québec', 'divers', false),
  (1, 'Aide juridique', 'divers', false),
  (1, 'Pension vieillesse', 'divers', false),
  (1, 'Déclaration de revenus', 'divers', false),
  (1, 'Camp de vacances familial', 'divers', false),
  -- ICI Santé
  (9, 'RDV médical', 'sante', true),
  (9, 'Accompagnement/interprétariat médical', 'sante', true),
  (9, 'Explication système de santé', 'sante', true),
  (9, 'RAMQ réfugiés acceptés', 'sante', true),
  (9, 'Ateliers thématiques santé', 'sante', true),
  -- Assermentation
  (2, 'Copies conformes', 'assermentation', false),
  (2, 'Déclaration solennelle', 'assermentation', false),
  (2, 'Lettre d''invitation', 'assermentation', false),
  (2, 'Autorisation de voyage', 'assermentation', false),
  (2, 'Procuration', 'assermentation', false),
  (2, 'Déclaration de célibat', 'assermentation', false);

-- ═══════════════════════════════════════════════════════
-- TABLE: conseillers (personnel)
-- Odoo mapping: res.users
-- ═══════════════════════════════════════════════════════
CREATE TABLE conseillers (
  id SERIAL PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT,
  service_id INT REFERENCES services(id),
  actif BOOLEAN DEFAULT true
);

-- Les plus actifs selon les données terrain
INSERT INTO conseillers (prenom, service_id) VALUES
  ('Ran', 1), ('Iryna', 1), ('Sadia', 1), ('Dian', 1),
  ('Merzouk', 1), ('Farah', 1), ('Safaa', 1), ('Taous', 1),
  ('Hakima', 1), ('Faten', 2);

-- ═══════════════════════════════════════════════════════
-- TABLE: visites (chaque interaction)
-- Odoo mapping: crm.lead
-- C'EST LA TABLE PRINCIPALE
-- ═══════════════════════════════════════════════════════
CREATE TABLE visites (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Qui
  nom_client TEXT,
  telephone TEXT,
  courriel TEXT,
  statut_immigration TEXT NOT NULL CHECK (statut_immigration IN (
    'Demandeur d''asile',
    'Demandeur d''asile (accepté)',
    'Résident permanent',
    'Permis de travail',
    'Permis de travail fermé',
    'Permis d''étude',
    'Citoyen canadien',
    'Visiteur',
    'Autre'
  )),
  nouveau_client BOOLEAN DEFAULT false,
  date_arrivee_canada DATE,

  -- Quoi
  service_id INT NOT NULL REFERENCES services(id),
  sous_service_id INT REFERENCES sous_services(id),

  -- Comment
  avec_rdv BOOLEAN DEFAULT false,
  mode TEXT DEFAULT 'en_personne' CHECK (mode IN ('en_personne', 'telephone', 'courriel', 'video')),

  -- Par qui
  conseiller_id INT REFERENCES conseillers(id),

  -- Notes
  notes TEXT,

  -- Source de la donnée (pour traçabilité et migration)
  source TEXT DEFAULT 'saisie' CHECK (source IN ('saisie', 'excel_import', 'fidelite_import')),

  -- Métadonnées pour migration Odoo
  odoo_imported BOOLEAN DEFAULT false,
  odoo_lead_id INT
);

-- Index pour les requêtes fréquentes du dashboard
CREATE INDEX idx_visites_created ON visites(created_at);
CREATE INDEX idx_visites_service ON visites(service_id);
CREATE INDEX idx_visites_statut ON visites(statut_immigration);
CREATE INDEX idx_visites_conseiller ON visites(conseiller_id);

-- ═══════════════════════════════════════════════════════
-- VUE: stats quotidiennes (pour le dashboard)
-- ═══════════════════════════════════════════════════════
CREATE VIEW v_stats_daily AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE avec_rdv) as rdv,
  COUNT(*) FILTER (WHERE NOT avec_rdv) as sans_rdv,
  COUNT(*) FILTER (WHERE nouveau_client) as nouveau,
  COUNT(*) FILTER (WHERE NOT nouveau_client) as existant
FROM visites
GROUP BY DATE(created_at)
ORDER BY date;

-- ═══════════════════════════════════════════════════════
-- VUE: stats par service
-- ═══════════════════════════════════════════════════════
CREATE VIEW v_stats_services AS
SELECT
  s.nom as service,
  COUNT(*) as total,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM visites) * 100, 1) as pct,
  COUNT(*) FILTER (WHERE v.avec_rdv) as avec_rdv,
  COUNT(*) FILTER (WHERE v.nouveau_client) as nouveaux
FROM visites v
JOIN services s ON v.service_id = s.id
GROUP BY s.nom, s.ordre
ORDER BY s.ordre;

-- ═══════════════════════════════════════════════════════
-- VUE: stats par statut
-- ═══════════════════════════════════════════════════════
CREATE VIEW v_stats_statuts AS
SELECT
  statut_immigration as statut,
  COUNT(*) as total,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM visites) * 100, 1) as pct
FROM visites
GROUP BY statut_immigration
ORDER BY total DESC;

-- ═══════════════════════════════════════════════════════
-- VUE: stats mensuelles
-- ═══════════════════════════════════════════════════════
CREATE VIEW v_stats_monthly AS
SELECT
  TO_CHAR(created_at, 'YYYY-MM') as mois,
  TO_CHAR(created_at, 'Mon') as mois_court,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE avec_rdv) as rdv,
  COUNT(*) FILTER (WHERE NOT avec_rdv) as sans_rdv,
  COUNT(*) FILTER (WHERE nouveau_client) as nouveau,
  COUNT(*) FILTER (WHERE NOT nouveau_client) as existant
FROM visites
GROUP BY TO_CHAR(created_at, 'YYYY-MM'), TO_CHAR(created_at, 'Mon')
ORDER BY mois;

-- ═══════════════════════════════════════════════════════
-- VUE: stats par conseiller
-- ═══════════════════════════════════════════════════════
CREATE VIEW v_stats_conseillers AS
SELECT
  c.prenom,
  s.nom as service,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE v.nouveau_client) as nouveaux,
  COUNT(*) FILTER (WHERE v.avec_rdv) as avec_rdv
FROM visites v
JOIN conseillers c ON v.conseiller_id = c.id
JOIN services s ON v.service_id = s.id
GROUP BY c.prenom, s.nom
ORDER BY total DESC;

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (Supabase)
-- ═══════════════════════════════════════════════════════
ALTER TABLE visites ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sous_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE conseillers ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour le dashboard), écriture authentifiée (pour la saisie)
CREATE POLICY "Lecture publique" ON visites FOR SELECT USING (true);
CREATE POLICY "Insertion authentifiée" ON visites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Lecture services" ON services FOR SELECT USING (true);
CREATE POLICY "Lecture sous_services" ON sous_services FOR SELECT USING (true);
CREATE POLICY "Lecture conseillers" ON conseillers FOR SELECT USING (true);
```

---

## PHASE 1 — RESTRUCTURER LE PROJET

### 1.1 Nouvelle structure de fichiers

```
caridashboard/
├── public/
│   └── CARI_Horizontal_RGB_reverse.png
├── src/
│   ├── lib/
│   │   └── supabase.js            # Client Supabase
│   ├── hooks/
│   │   └── useVisites.js          # Hook pour requêtes dashboard
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx      # Le dashboard actuel (lecture seule)
│   │   │   ├── KpiCard.jsx        # Composant KPI extrait
│   │   │   ├── Card.jsx           # Composant Card extrait
│   │   │   └── Tip.jsx            # Composant Tip extrait
│   │   └── saisie/
│   │       ├── Saisie.jsx         # Formulaire de saisie principal
│   │       ├── ServiceSelect.jsx  # Dropdown service → sous-service conditionnel
│   │       └── ConfirmationMsg.jsx
│   ├── data/
│   │   └── static-data.js         # Données hardcodées actuelles (fallback)
│   ├── theme.js                   # COLORS et PIE_COLORS extraits
│   ├── App.jsx                    # Router: /dashboard et /saisie
│   └── main.jsx                   # Point d'entrée
├── index.html
├── netlify.toml
├── vite.config.js
└── package.json
```

### 1.2 App.jsx — Routage simple

```jsx
import { useState, useEffect } from 'react'
import Dashboard from './components/dashboard/Dashboard'
import Saisie from './components/saisie/Saisie'

export default function App() {
  const path = window.location.pathname
  if (path === '/saisie') return <Saisie />
  return <Dashboard />
}
```

Pas besoin de react-router, un simple check de pathname suffit.
Le personnel accède à `caridashboard.netlify.app/saisie` sur la tablette.
Le dashboard reste à `caridashboard.netlify.app/`

### 1.3 Déplacer les données statiques

Extraire TOUS les `const MONTHLY`, `SERVICES`, `STATUTS`, etc. de `cari-dashboard.jsx` vers `src/data/static-data.js`. Ces données servent de **fallback** si Supabase n'est pas accessible ou pas encore configuré. Le dashboard doit fonctionner dans les deux modes (statique ET live).

---

## PHASE 2 — FORMULAIRE DE SAISIE (/saisie)

### 2.1 Design et fonctionnement

Le formulaire doit être **optimisé tablette** (iPad ou Android 10"), utilisé par le personnel d'accueil. C'est PAS un formulaire pour les clients.

**Palette:** identique au dashboard (fond #263164, cartes blanches, accents CARI)
**Typo:** DM Sans
**Logo:** CARI en haut

**Flow en une seule page (pas d'étapes):**

```
┌─────────────────────────────────────────────┐
│  [Logo CARI]  Saisie visite    [Conseiller ▼] │
├─────────────────────────────────────────────┤
│                                             │
│  Service *          [Dropdown ▼]            │
│  Sous-service       [Dropdown conditionnel] │
│  ──────────────────────────────────────     │
│  Statut immigration * [Dropdown ▼]          │
│  Nouveau client?    [Oui] [Non]             │
│  Avec rendez-vous?  [Oui] [Non]             │
│  ──────────────────────────────────────     │
│  Nom client         [________________]      │
│  Téléphone          [________________]      │
│  ──────────────────────────────────────     │
│  Notes              [________________]      │
│                                             │
│  [  ✓  ENREGISTRER LA VISITE  ]             │
│                                             │
│  ── Dernières saisies ──                    │
│  14:32 Ran — Accueil — DA — nouveau ✓       │
│  14:28 Sadia — Emploi — RP — existant       │
│  14:15 Ran — Assermentation — Citoyen        │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 Comportements clés

**Conseiller persistant:** Le dropdown du conseiller en haut est sticky (localStorage). Le matin, le conseiller se sélectionne une fois et ça reste toute la journée.

**Sous-service conditionnel:** Quand le service est "Accueil et intégration", le dropdown sous-service affiche les 40+ sous-services groupés par catégorie (Installation, Post-installation, Immigration, Immigration DA, Divers). Quand c'est "Assermentation", il affiche (Copies conformes, Déclaration solennelle, etc.). Pour les autres services, pas de sous-service.

**Validation minimale:** Seuls service + statut immigration sont obligatoires. Le reste est optionnel pour ne pas ralentir le flux. L'accueil est achalandé, la saisie doit prendre < 15 secondes.

**Feedback:** Après enregistrement, message de confirmation 2 secondes, formulaire réinitialisé (sauf conseiller), focus sur le premier champ. Liste des dernières saisies en bas comme confirmation visuelle.

**Mode assermentation rapide:** Quand "Assermentation" est sélectionné, le formulaire se simplifie: pas de champ nom/téléphone (le programme fidélité d'Aminata les collecte déjà sur la tablette séparée). Juste: sous-type d'assermentation + statut + nouveau client. Ultra rapide.

### 2.3 Sécurité

La page /saisie est protégée par un simple code d'équipe (pas un vrai auth system — on est en MVP):

```jsx
// PIN stocké en variable d'env Netlify
const TEAM_PIN = import.meta.env.VITE_TEAM_PIN || '2007' // numéro téléphone CARI par défaut
```

Le PIN est demandé une fois par session, stocké en sessionStorage.

---

## PHASE 3 — CONNECTER LE DASHBOARD À SUPABASE

### 3.1 Hook `useVisites`

Créer `src/hooks/useVisites.js` — un hook React qui:
1. Tente de charger les données de Supabase
2. Si Supabase n'est pas dispo (pas de clé API, erreur réseau), fall back sur les données statiques
3. Retourne les données dans le même format que les constantes actuelles

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as STATIC from '../data/static-data'

export function useVisites() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // Tester si Supabase est configuré
        if (!import.meta.env.VITE_SUPABASE_URL) throw new Error('No Supabase')

        // Charger depuis les vues Supabase
        const [daily, services, statuts, monthly] = await Promise.all([
          supabase.from('v_stats_daily').select('*'),
          supabase.from('v_stats_services').select('*'),
          supabase.from('v_stats_statuts').select('*'),
          supabase.from('v_stats_monthly').select('*'),
        ])

        // Transformer au format attendu par le dashboard
        setData({
          MONTHLY: monthly.data,
          SERVICES: services.data,
          STATUTS: statuts.data,
          DAILY: daily.data,
          // ... etc
        })
        setIsLive(true)
      } catch (e) {
        // Fallback données statiques
        setData(STATIC)
        setIsLive(false)
      }
      setLoading(false)
    }
    load()
  }, [])

  return { data, loading, isLive }
}
```

### 3.2 Modifier le Dashboard

Dans `Dashboard.jsx`, remplacer les imports directs des constantes par le hook:

```jsx
const { data, loading, isLive } = useVisites()
if (loading) return <LoadingScreen />
const { MONTHLY, SERVICES, STATUTS, DAILY, ... } = data
```

Ajouter un petit badge en haut du dashboard: "🟢 Données en direct" ou "⚪ Données historiques (mai 2025 – fév 2026)" selon `isLive`.

### 3.3 Nouveau tab "Équipe" (optionnel)

Si les données live sont disponibles, ajouter un 6e onglet "Équipe" avec:
- Charge de travail par conseiller (bar chart)
- Type de service par conseiller
- Tendance d'activité par conseiller

Ce tab ne s'affiche que si `isLive === true`.

---

## PHASE 4 — IMPORT DES DONNÉES HISTORIQUES

### 4.1 Script d'import du fichier Excel existant

Créer un script Node.js one-shot `scripts/import-excel.js` qui:
1. Lit le fichier Excel original (les 50 499 lignes, 7 feuilles)
2. Mappe les colonnes vers la table `visites`
3. Insère dans Supabase via l'API

Mapping:
- `Date_Entree` + `Heure_Entree` → `created_at`
- `Service` → `service_id` (lookup dans table services)
- `Statut` → `statut_immigration`
- `Nouveau` (Oui/Non) → `nouveau_client`
- `RDV` (Avec/Sans) → `avec_rdv`
- `Commentaire` → extraire nom de conseiller si possible, sinon → `notes`

### 4.2 Import du fichier fidélité assermentation

Script séparé `scripts/import-fidelite.js` qui importe les 2 380 entrées du CSV d'Aminata dans la table visites (service = Assermentation).

---

## PHASE 5 — NETLIFY CONFIG

### 5.1 Variables d'environnement à configurer dans Netlify

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx
VITE_TEAM_PIN=XXXX
```

### 5.2 netlify.toml mis à jour

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/saisie"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## PHASE 4B — PLAN DE BASCULE EXCEL → SUPABASE

Le fichier Excel joint au prompt est la source de données actuelle du CARI. Le personnel d'accueil le remplit manuellement chaque jour. La bascule doit être progressive, pas un big bang.

### Colonne `source` à ajouter au schéma SQL

```sql
-- Ajouter dans CREATE TABLE visites:
source TEXT DEFAULT 'saisie' CHECK (source IN ('saisie', 'excel_import', 'fidelite_import'))
```

### Étape 1 — Import initial (Jour J-1)

Créer un script `scripts/import-excel.js` qui:
- Lit le fichier Excel joint (toutes les feuilles, toutes les lignes)
- Mappe chaque ligne vers la table `visites` Supabase:
  - `Date_Entree` + `Heure_Entree` → `created_at`
  - `Service` → `service_id` (lookup table services)
  - `Statut` → `statut_immigration`
  - `Nouveau` → `nouveau_client` (boolean)
  - `RDV` → `avec_rdv` (boolean)
  - `Commentaire` → tenter d'extraire le nom du conseiller (matcher contre la table `conseillers`), le reste va dans `notes`
- Log les lignes qui ne matchent pas pour review manuel
- Marque toutes ces entrées comme `source = 'excel_import'`
- Le script doit être **idempotent** — relançable sans créer de doublons (vérifier date + heure + service comme clé naturelle)

### Étape 2 — Période parallèle (Semaine 1-2)

Pendant les deux premières semaines, le personnel continue de remplir le Excel EN PLUS de la saisie tablette. Ça permet de:
- Valider que les chiffres concordent
- Identifier les écarts de saisie
- Rassurer la direction que rien ne se perd

Le dashboard affiche un indicateur: `📊 Données live depuis [date de bascule] + historique importé (mai 2025 – [date])`

Prévoir un script `scripts/sync-excel.js` qui peut réimporter un Excel mis à jour pour combler les trous si la saisie tablette a été oubliée certains jours.

### Étape 3 — Coupure Excel (Semaine 3+)

Quand les chiffres concordent et que l'équipe est à l'aise, on arrête le Excel. Le dashboard devient la source unique. Le dernier Excel est archivé.

---

## PHASE 6 — ADAPTER LA SECTION EMPLOI AU PROFIL RÉEL

La majorité de la clientèle du service Emploi sont des résidents permanents déjà établis, pas des nouveaux arrivants. Le chatbot et le dashboard doivent refléter cette réalité.

Dans le formulaire de saisie, quand le service "Emploi" est sélectionné, les sous-services doivent inclure:
- Reconnaissance des diplômes et compétences (ordres professionnels, MIFI, RAC)
- Production de CV format québécois
- Préparation aux entrevues
- Réseautage professionnel
- Ateliers de recherche d'emploi
- Placement en emploi et stages
- Soutien personnalisé

Dans le dashboard, si on a assez de données, un breakdown Emploi par sous-service et par statut immigration serait révélateur (on verra la surreprésentation des résidents permanents).

---

## ORDRE D'EXÉCUTION

```
Phase 0   →  Setup Supabase (schema SQL, tables, vues)
Phase 1   →  Restructurer le projet (extraire composants, routing)
Phase 2   →  Formulaire de saisie (/saisie)
Phase 3   →  Connecter dashboard à Supabase (hook, fallback statique)
Phase 4   →  Importer données historiques (Excel + CSV fidélité)
Phase 4B  →  Bascule progressive (parallèle 2 semaines, puis coupure Excel)
Phase 5   →  Config Netlify + deploy
Phase 6   →  Enrichissements (breakdown Emploi, tab Équipe)
```

**Phase 1 et 2 sont indépendantes** — on peut les faire en parallèle.
**Phase 3 dépend de Phase 0 et 1.**
**Phase 4 peut se faire à n'importe quel moment après Phase 0.**
**Phase 4B est le déploiement terrain — impliquer Aminata pour coordonner avec l'équipe d'accueil.**

## NOTE MIGRATION ODOO

Quand Odoo sera prêt, la migration se fait en 3 étapes:
1. Export Supabase → CSV (toutes les tables)
2. Import CSV dans Odoo (mapping déjà documenté dans les commentaires SQL)
3. Changer `src/lib/supabase.js` pour pointer vers l'API REST d'Odoo au lieu de Supabase

La structure des données (services, sous-services, statuts) est identique — seul le transport change.
