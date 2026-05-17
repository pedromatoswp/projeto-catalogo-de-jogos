-- ============================================================
-- GameCatalog — Relational SQL Setup for Supabase
-- ============================================================

-- Limpar tabelas antigas (caso você já tenha rodado antes)
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS studios;

-- ────────────────────────────────────────────────────────────
-- 1. CRIAR TABELA: studios (Lado "1" do relacionamento)
-- ────────────────────────────────────────────────────────────
CREATE TABLE studios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL
);

-- ────────────────────────────────────────────────────────────
-- 2. CRIAR TABELA: games (Lado "N" do relacionamento)
-- ────────────────────────────────────────────────────────────
-- Veja a coluna "studio_id": Ela é uma CHAVE ESTRANGEIRA (Foreign Key).
-- Isso cria o relacionamento: 1 Estúdio pode ter N Jogos.
CREATE TABLE games (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  genre        VARCHAR(50)  NOT NULL,
  platform     VARCHAR(50)  NOT NULL,
  release_year INTEGER      NOT NULL,
  description  TEXT         NOT NULL,
  image_url    TEXT         NOT NULL,
  trailer_url  TEXT,
  studio_id    INTEGER      REFERENCES studios(id) ON DELETE SET NULL
);


-- ────────────────────────────────────────────────────────────
-- 3. INSERIR DADOS: studios
-- ────────────────────────────────────────────────────────────
INSERT INTO studios (name, country) VALUES
('EA Sports', 'EUA'),           -- id: 1
('Riot Games', 'EUA'),          -- id: 2
('Epic Games', 'EUA'),          -- id: 3
('2K Sports', 'EUA'),           -- id: 4
('Team Cherry', 'Austrália'),   -- id: 5
('Mojang', 'Suécia'),           -- id: 6
('Rockstar Games', 'EUA'),      -- id: 7
('Activision', 'EUA'),          -- id: 8
('FromSoftware', 'Japão');      -- id: 9


-- ────────────────────────────────────────────────────────────
-- 4. INSERIR DADOS: games (Agora com o studio_id!)
-- ────────────────────────────────────────────────────────────
INSERT INTO games (name, genre, platform, release_year, description, image_url, trailer_url, studio_id) VALUES
(
  'FIFA 26', 'Sports', 'Multi-platform', 2025,
  'The latest edition of EA Sports'' iconic football simulation.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1
),
(
  'Valorant', 'FPS', 'PC', 2020,
  'Riot Games'' tactical 5v5 character-based shooter.',
  'https://images.unsplash.com/photo-1633545495735-25ebda6c5c0c?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  2
),
(
  'Fortnite', 'Battle Royale', 'Multi-platform', 2017,
  'Epic Games'' iconic battle royale where 100 players drop onto an island.',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  3
),
(
  'NBA 2K26', 'Sports', 'Multi-platform', 2025,
  'The definitive basketball simulation experience.',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  4
),
(
  'Hollow Knight', 'Metroidvania', 'Multi-platform', 2017,
  'A challenging and atmospheric action-adventure set in the vast underground kingdom.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  5
),
(
  'Minecraft', 'Sandbox', 'Multi-platform', 2011,
  'The world''s best-selling game. Mine resources, craft tools, and build anything.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  6
),
(
  'GTA VI', 'Action/Adventure', 'Multi-platform', 2025,
  'Rockstar''s long-awaited open-world epic set in the fictional Leonida state.',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  7
),
(
  'Call of Duty', 'FPS', 'Multi-platform', 2003,
  'The legendary military first-person shooter franchise.',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  8
);


-- ────────────────────────────────────────────────────────────
-- 5. Exemplo de SELECT com JOIN (Para o professor ver!)
-- ────────────────────────────────────────────────────────────
-- SELECT g.name as game, s.name as studio
-- FROM games g
-- JOIN studios s ON g.studio_id = s.id;


-- ────────────────────────────────────────────────────────────
-- 6. RLS (Row Level Security) - Liberar acesso
-- ────────────────────────────────────────────────────────────
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read games" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update games" ON games FOR UPDATE USING (true);
CREATE POLICY "Allow public delete games" ON games FOR DELETE USING (true);

ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read studios" ON studios FOR SELECT USING (true);
