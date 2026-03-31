
-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Gifticons table
CREATE TABLE public.gifticons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES public.categories(slug),
  price INTEGER NOT NULL,
  image_url TEXT,
  trend_badge TEXT CHECK (trend_badge IN ('급상승', '신규', '화제', '스테디')),
  vote_count_want INTEGER NOT NULL DEFAULT 0,
  vote_count_bad INTEGER NOT NULL DEFAULT 0,
  prev_rank_want INTEGER,
  prev_rank_bad INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gifticons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gifticons are viewable by everyone" ON public.gifticons FOR SELECT USING (true);
CREATE POLICY "Gifticons vote counts can be updated by anyone" ON public.gifticons FOR UPDATE USING (true) WITH CHECK (true);

-- User sessions table
CREATE TABLE public.user_sessions (
  session_id TEXT PRIMARY KEY,
  daily_votes_used INTEGER NOT NULL DEFAULT 0,
  daily_votes_limit INTEGER NOT NULL DEFAULT 2,
  last_vote_date DATE,
  is_open_event BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions viewable by everyone" ON public.user_sessions FOR SELECT USING (true);
CREATE POLICY "Sessions insertable by everyone" ON public.user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions updatable by everyone" ON public.user_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- Votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gifticon_id UUID NOT NULL REFERENCES public.gifticons(id),
  session_id TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('want', 'bad')),
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes viewable by everyone" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Votes insertable by everyone" ON public.votes FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_gifticons_category ON public.gifticons(category_slug);
CREATE INDEX idx_gifticons_want ON public.gifticons(vote_count_want DESC);
CREATE INDEX idx_gifticons_bad ON public.gifticons(vote_count_bad DESC);
CREATE INDEX idx_votes_session ON public.votes(session_id);
CREATE INDEX idx_votes_gifticon ON public.votes(gifticon_id);

-- Seed categories
INSERT INTO public.categories (name, slug, emoji, sort_order) VALUES
  ('전체', 'all', '🎁', 0),
  ('카페', 'cafe', '☕', 1),
  ('치킨', 'chicken', '🍗', 2),
  ('피자', 'pizza', '🍕', 3),
  ('편의점', 'convenience', '🏪', 4),
  ('뷰티', 'beauty', '💄', 5),
  ('상품권', 'voucher', '💳', 6);

-- Seed gifticons
INSERT INTO public.gifticons (name, brand, category_slug, price, trend_badge, vote_count_want, vote_count_bad, prev_rank_want) VALUES
  ('아메리카노 Tall', '스타벅스', 'cafe', 4500, '급상승', 980, 12, 3),
  ('1만원권', '네이버페이', 'voucher', 10000, '스테디', 880, 8, 2),
  ('싱글레귤러', '배스킨라빈스', 'cafe', 3500, '스테디', 850, 15, 4),
  ('뿌링클', 'bhc', 'chicken', 21000, '급상승', 830, 20, 6),
  ('황금올리브 치킨', 'BBQ', 'chicken', 23000, '화제', 810, 18, 5),
  ('허니콤보', '교촌', 'chicken', 22000, '스테디', 760, 22, 7),
  ('아메리카노 L', '메가커피', 'cafe', 2000, '신규', 720, 45, 8),
  ('편의점 5천원권', 'CU', 'convenience', 5000, '스테디', 710, 38, 9),
  ('도시락 교환권', 'GS25', 'convenience', 4800, '급상승', 670, 52, 11),
  ('빽사이즈 아메리카노', '빽다방', 'cafe', 2500, '화제', 650, 61, 10),
  ('5천원권', '카카오페이', 'voucher', 5000, '화제', 620, 9, 12),
  ('1만원 금액권', '올리브영', 'beauty', 10000, '신규', 540, 14, 13),
  ('슈퍼슈프림 M', '피자헛', 'pizza', 28000, '스테디', 520, 71, 14),
  ('포테이토 R', '도미노피자', 'pizza', 25000, '화제', 590, 44, 15);
