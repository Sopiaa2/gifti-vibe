
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wish_id TEXT NOT NULL UNIQUE,
  gifticon_ids UUID[] NOT NULL DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_wishlists_wish_id ON public.wishlists(wish_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wishlists viewable by everyone"
ON public.wishlists FOR SELECT USING (true);

CREATE POLICY "Wishlists insertable by everyone"
ON public.wishlists FOR INSERT WITH CHECK (true);

CREATE POLICY "Wishlists updatable by everyone"
ON public.wishlists FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE public.gifticons ADD COLUMN wish_count INTEGER NOT NULL DEFAULT 0;
