-- ============================================================
-- GameCatalog — SQL Setup for Supabase
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. CREATE TABLE
-- ────────────────────────────────────────────────────────────
-- Each column is explained below:
--   id           SERIAL PRIMARY KEY  → Auto-increments (1, 2, 3...), uniquely identifies each game
--   name         VARCHAR(100)        → Text up to 100 characters (game titles are short)
--   genre        VARCHAR(50)         → Text up to 50 chars (FPS, Sports, etc.)
--   platform     VARCHAR(50)         → Text up to 50 chars (PC, PS5, etc.)
--   release_year INTEGER             → Whole number, no decimals needed for a year
--   description  TEXT                → Unlimited text (no character limit for long descriptions)
--   image_url    TEXT                → Unlimited text (URLs can be long)

CREATE TABLE IF NOT EXISTS games (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  genre        VARCHAR(50)  NOT NULL,
  platform     VARCHAR(50)  NOT NULL,
  release_year INTEGER      NOT NULL,
  description  TEXT         NOT NULL,
  image_url    TEXT         NOT NULL
);


-- ────────────────────────────────────────────────────────────
-- 2. INITIAL DATA (INSERT)
-- These are the 8 required games for the project
-- ────────────────────────────────────────────────────────────

INSERT INTO games (name, genre, platform, release_year, description, image_url) VALUES
(
  'FIFA 26',
  'Sports',
  'Multi-platform',
  2025,
  'The latest edition of EA Sports'' iconic football simulation. Features improved player AI, updated rosters, and stunning next-gen graphics for the most realistic football experience yet.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop'
),
(
  'Valorant',
  'FPS',
  'PC',
  2020,
  'Riot Games'' tactical 5v5 character-based shooter. Combines precise gunplay with unique agent abilities. Master the art of strategy and aim to climb the competitive ladder.',
  'https://images.unsplash.com/photo-1633545495735-25ebda6c5c0c?w=600&h=400&fit=crop'
),
(
  'Fortnite',
  'Battle Royale',
  'Multi-platform',
  2017,
  'Epic Games'' iconic battle royale where 100 players drop onto an island and fight to be the last one standing. Features building mechanics, seasonal events, and massive crossovers.',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop'
),
(
  'NBA 2K26',
  'Sports',
  'Multi-platform',
  2025,
  'The definitive basketball simulation experience. Play with your favorite NBA teams and legends, build your custom player in MyCareer, or manage your own franchise.',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop'
),
(
  'Hollow Knight',
  'Metroidvania',
  'Multi-platform',
  2017,
  'A challenging and atmospheric action-adventure set in the vast underground kingdom of Hallownest. Explore twisting caverns, battle tainted creatures, and uncover ancient history.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop'
),
(
  'Minecraft',
  'Sandbox',
  'Multi-platform',
  2011,
  'The world''s best-selling game. Mine resources, craft tools, and build anything you can imagine — from simple shelters to massive cities. Survive monsters or just create freely.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
),
(
  'GTA VI',
  'Action/Adventure',
  'Multi-platform',
  2025,
  'Rockstar''s long-awaited open-world epic set in the fictional Leonida state. Features two protagonists, a massive living world, and the most detailed GTA experience ever created.',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop'
),
(
  'Call of Duty',
  'FPS',
  'Multi-platform',
  2003,
  'The legendary military first-person shooter franchise. Experience intense single-player campaigns, the iconic Warzone battle royale, and fast-paced multiplayer combat.',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop'
);


-- ────────────────────────────────────────────────────────────
-- 3. CRUD QUERIES (for reference and study)
-- ────────────────────────────────────────────────────────────

-- READ: Get all games
SELECT * FROM games;

-- READ: Get all games ordered by name
SELECT * FROM games ORDER BY name ASC;

-- READ: Filter by genre
SELECT * FROM games WHERE genre = 'FPS';

-- READ: Search by name (partial match, case-insensitive)
SELECT * FROM games WHERE name ILIKE '%call%';

-- CREATE: Insert a new game
INSERT INTO games (name, genre, platform, release_year, description, image_url)
VALUES (
  'Elden Ring',
  'RPG',
  'Multi-platform',
  2022,
  'An open-world action RPG developed by FromSoftware and George R.R. Martin.',
  'https://example.com/elden-ring.jpg'
);

-- UPDATE: Edit a game by ID
UPDATE games
SET name = 'Elden Ring: Shadow of the Erdtree',
    release_year = 2024
WHERE id = 9;

-- DELETE: Remove a game by ID
DELETE FROM games WHERE id = 9;


-- ────────────────────────────────────────────────────────────
-- 4. OPTIONAL: Enable Row Level Security (RLS) on Supabase
-- This controls who can read/write data.
-- For a public demo, we allow all access:
-- ────────────────────────────────────────────────────────────

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read games (public catalog)
CREATE POLICY "Allow public read"
  ON games FOR SELECT
  USING (true);

-- Allow anyone to insert, update, delete (open for demo purposes)
-- In a real app, you'd restrict this to authenticated users
CREATE POLICY "Allow public insert"
  ON games FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON games FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete"
  ON games FOR DELETE
  USING (true);
