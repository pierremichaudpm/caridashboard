-- Table membres — Gestion des adhésions CARI St-Laurent
-- À exécuter dans Supabase SQL Editor

CREATE TABLE membres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text,
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text,
  email text,
  adresse text,
  num_app text,
  ville text,
  code_postal text,
  date_adhesion date,
  date_renouvellement date,
  date_fin date,
  langue text,
  etat text,             -- 'N' = Nouveau, 'R' = Renouvellement
  type_membre text,       -- 'individuel', 'corporatif', 'honoraire'
  detail_type text,
  presences_aga jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX idx_membres_nom ON membres (nom, prenom);
CREATE INDEX idx_membres_email ON membres (email);
CREATE INDEX idx_membres_date_fin ON membres (date_fin);
CREATE INDEX idx_membres_type ON membres (type_membre);

-- RLS
ALTER TABLE membres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON membres
  FOR ALL USING (true) WITH CHECK (true);
