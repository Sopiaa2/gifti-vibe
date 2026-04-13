
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  price_range TEXT NOT NULL,
  session_id TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suggestions viewable by everyone"
  ON public.suggestions FOR SELECT
  USING (true);

CREATE POLICY "Suggestions insertable by everyone"
  ON public.suggestions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Suggestions updatable by everyone"
  ON public.suggestions FOR UPDATE
  USING (true)
  WITH CHECK (true);
