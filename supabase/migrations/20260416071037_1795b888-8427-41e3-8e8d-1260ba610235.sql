
ALTER TABLE public.user_sessions
ADD COLUMN want_votes_used integer NOT NULL DEFAULT 0,
ADD COLUMN bad_votes_used integer NOT NULL DEFAULT 0;

-- Migrate existing data: copy daily_votes_used to want_votes_used
UPDATE public.user_sessions SET want_votes_used = daily_votes_used;
