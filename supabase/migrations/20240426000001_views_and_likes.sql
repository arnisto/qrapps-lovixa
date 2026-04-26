-- Create a polymorphic likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('plan', 'activity')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, target_id)
);

-- Index for fast checking if a user liked an item
CREATE INDEX IF NOT EXISTS idx_likes_user_target ON public.likes(user_id, target_id);

-- Function to handle like/unlike count synchronization
CREATE OR REPLACE FUNCTION public.handle_like_sync()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.target_type = 'plan') THEN
      UPDATE public.plans SET likes = likes + 1 WHERE id = NEW.target_id;
    ELSIF (NEW.target_type = 'activity') THEN
      UPDATE public.activities SET likes = likes + 1 WHERE id = NEW.target_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.target_type = 'plan') THEN
      UPDATE public.plans SET likes = GREATEST(0, likes - 1) WHERE id = OLD.target_id;
    ELSIF (OLD.target_type = 'activity') THEN
      UPDATE public.activities SET likes = GREATEST(0, likes - 1) WHERE id = OLD.target_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for likes
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_like_sync();

-- Scalable RPC for incrementing views (prevents common race conditions)
CREATE OR REPLACE FUNCTION public.increment_view(target_table TEXT, row_id UUID)
RETURNS void AS $$
BEGIN
  IF target_table = 'plans' THEN
    UPDATE public.plans SET views = views + 1 WHERE id = row_id;
  ELSIF target_table = 'activities' THEN
    UPDATE public.activities SET views = views + 1 WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS for likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON public.likes FOR ALL USING (auth.uid() = user_id);
