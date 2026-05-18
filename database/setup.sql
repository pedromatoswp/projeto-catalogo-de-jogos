-- ============================================================
-- GameCatalog — Relational SQL Setup for Supabase
-- ============================================================

-- Limpar tabelas antigas (caso você já tenha rodado antes)
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS studios;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_library;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS list_games;
DROP TABLE IF EXISTS list_likes;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS game_screenshots;

-- ────────────────────────────────────────────────────────────
-- 1. CRIAR TABELA: studios (Lado "1" do relacionamento)
-- ────────────────────────────────────────────────────────────
CREATE TABLE studios (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50)
);

-- ────────────────────────────────────────────────────────────
-- 2. CRIAR TABELA: users (Sistema de usuários)
-- ────────────────────────────────────────────────────────────
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(50) UNIQUE NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name    VARCHAR(100),
  avatar_url   TEXT,
  bio          TEXT,
  is_admin     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 3. CRIAR TABELA: user_library (Biblioteca pessoal)
-- ────────────────────────────────────────────────────────────
CREATE TABLE user_library (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id    INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  status     VARCHAR(20) NOT NULL CHECK (status IN ('playing', 'completed', 'want_to_play', 'abandoned')),
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, game_id)
);

-- ────────────────────────────────────────────────────────────
-- 4. CRIAR TABELA: comments (Comentários em jogos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id    INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 5. CRIAR TABELA: comment_likes (Curtidas em comentários)
-- ────────────────────────────────────────────────────────────
CREATE TABLE comment_likes (
  id         SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id)
);

-- ────────────────────────────────────────────────────────────
-- 6. CRIAR TABELA: follows (Sistema de seguidores)
-- ────────────────────────────────────────────────────────────
CREATE TABLE follows (
  id          SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ────────────────────────────────────────────────────────────
-- 7. CRIAR TABELA: lists (Listas públicas)
-- ────────────────────────────────────────────────────────────
CREATE TABLE lists (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  cover_url   TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 8. CRIAR TABELA: list_games (Jogos nas listas)
-- ────────────────────────────────────────────────────────────
CREATE TABLE list_games (
  id        SERIAL PRIMARY KEY,
  list_id   INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  game_id   INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  added_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(list_id, game_id)
);

-- ────────────────────────────────────────────────────────────
-- 9. CRIAR TABELA: list_likes (Curtidas em listas)
-- ────────────────────────────────────────────────────────────
CREATE TABLE list_likes (
  id        SERIAL PRIMARY KEY,
  list_id   INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(list_id, user_id)
);

-- ────────────────────────────────────────────────────────────
-- 10. CRIAR TABELA: reviews (Avaliações de jogos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id         INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  overall_rating  INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 10),
  gameplay_rating INTEGER CHECK (gameplay_rating >= 1 AND gameplay_rating <= 10),
  story_rating    INTEGER CHECK (story_rating >= 1 AND story_rating <= 10),
  graphics_rating INTEGER CHECK (graphics_rating >= 1 AND graphics_rating <= 10),
  sound_rating    INTEGER CHECK (sound_rating >= 1 AND sound_rating <= 10),
  multiplayer_rating INTEGER CHECK (multiplayer_rating >= 1 AND multiplayer_rating <= 10),
  fun_rating      INTEGER CHECK (fun_rating >= 1 AND fun_rating <= 10),
  content         TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, game_id)
);

-- ────────────────────────────────────────────────────────────
-- 11. CRIAR TABELA: achievements (Conquistas)
-- ────────────────────────────────────────────────────────────
CREATE TABLE achievements (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url    TEXT,
  badge_color VARCHAR(20) DEFAULT 'gray'
);

-- ────────────────────────────────────────────────────────────
-- 12. CRIAR TABELA: user_achievements (Conquistas desbloqueadas)
-- ────────────────────────────────────────────────────────────
CREATE TABLE user_achievements (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- ────────────────────────────────────────────────────────────
-- 13. CRIAR TABELA: activities (Timeline de atividades)
-- ────────────────────────────────────────────────────────────
CREATE TABLE activities (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  content    TEXT,
  game_id    INTEGER REFERENCES games(id) ON DELETE CASCADE,
  list_id    INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 14. CRIAR TABELA: game_screenshots (Screenshots de jogos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE game_screenshots (
  id        SERIAL PRIMARY KEY,
  game_id   INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_num INTEGER DEFAULT 0
);

-- ────────────────────────────────────────────────────────────
-- 2. CRIAR TABELA: games (Lado "N" do relacionamento)
-- ────────────────────────────────────────────────────────────
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
