-- Lovixa Phase 1 — Ghost Vote Schema
-- supabase/migrations/001_ghost_vote_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SESSIONS
-- ============================================
CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token   UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL DEFAULT 'Untitled Session',
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'matched', 'expired')),
  participant_count INT NOT NULL DEFAULT 1,
  winning_card_id   UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

CREATE INDEX idx_sessions_share_token ON sessions(share_token);
CREATE INDEX idx_sessions_host_status ON sessions(host_id, status);

-- ============================================
-- VIBE CARDS
-- ============================================
CREATE TABLE vibe_cards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  venue_data    JSONB,
  position      SMALLINT NOT NULL CHECK (position BETWEEN 0 AND 2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, position)
);

CREATE INDEX idx_vibe_cards_session ON vibe_cards(session_id);

-- ============================================
-- VOTES
-- ============================================
CREATE TABLE votes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  card_id       UUID NOT NULL REFERENCES vibe_cards(id) ON DELETE CASCADE,
  voter_id      UUID NOT NULL,
  vote          BOOLEAN NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, card_id, voter_id)
);

CREATE INDEX idx_votes_session_card ON votes(session_id, card_id);
CREATE INDEX idx_votes_session_voter ON votes(session_id, voter_id);

-- ============================================
-- Add FK for winning_card_id after vibe_cards exists
-- ============================================
ALTER TABLE sessions
  ADD CONSTRAINT fk_winning_card
  FOREIGN KEY (winning_card_id) REFERENCES vibe_cards(id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Host can manage own sessions"
  ON sessions FOR ALL
  USING (auth.uid() = host_id);

CREATE POLICY "Anyone can read sessions"
  ON sessions FOR SELECT
  USING (true);

ALTER TABLE vibe_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vibe cards"
  ON vibe_cards FOR SELECT USING (true);

CREATE POLICY "Host can insert vibe cards"
  ON vibe_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = vibe_cards.session_id
      AND sessions.host_id = auth.uid()
    )
  );

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read votes"
  ON votes FOR SELECT USING (true);

-- ============================================
-- Enable Realtime on votes table
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
