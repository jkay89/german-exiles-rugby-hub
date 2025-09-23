-- Create lottery entries table to store user's selected numbers
CREATE TABLE public.lottery_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numbers INTEGER[] NOT NULL CHECK (array_length(numbers, 1) = 6),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  stripe_subscription_id TEXT,
  line_number INTEGER NOT NULL DEFAULT 1
);

-- Create lottery draws table to store winning numbers
CREATE TABLE public.lottery_draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_date DATE NOT NULL,
  winning_numbers INTEGER[] NOT NULL CHECK (array_length(winning_numbers, 1) = 6),
  jackpot_amount DECIMAL(10,2) DEFAULT 0,
  lucky_dip_amount DECIMAL(10,2) DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lottery subscriptions table to track user subscriptions
CREATE TABLE public.lottery_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  lines_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_draw_date DATE
);

-- Create lottery results table to track wins
CREATE TABLE public.lottery_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_id UUID NOT NULL REFERENCES public.lottery_draws(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.lottery_entries(id) ON DELETE CASCADE,
  matches INTEGER NOT NULL DEFAULT 0,
  prize_amount DECIMAL(10,2) DEFAULT 0,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lottery_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lottery_entries
CREATE POLICY "Users can view their own lottery entries" 
ON public.lottery_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lottery entries" 
ON public.lottery_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lottery entries" 
ON public.lottery_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lottery entries" 
ON public.lottery_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for lottery_draws (public read access)
CREATE POLICY "Anyone can view lottery draws" 
ON public.lottery_draws 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage lottery draws" 
ON public.lottery_draws 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create RLS policies for lottery_subscriptions
CREATE POLICY "Users can view their own lottery subscriptions" 
ON public.lottery_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lottery subscriptions" 
ON public.lottery_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lottery subscriptions" 
ON public.lottery_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for lottery_results
CREATE POLICY "Users can view their own lottery results" 
ON public.lottery_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage lottery results" 
ON public.lottery_results 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_lottery_entries_user_id ON public.lottery_entries(user_id);
CREATE INDEX idx_lottery_entries_active ON public.lottery_entries(is_active);
CREATE INDEX idx_lottery_subscriptions_user_id ON public.lottery_subscriptions(user_id);
CREATE INDEX idx_lottery_subscriptions_stripe_id ON public.lottery_subscriptions(stripe_subscription_id);
CREATE INDEX idx_lottery_results_user_id ON public.lottery_results(user_id);
CREATE INDEX idx_lottery_results_draw_id ON public.lottery_results(draw_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_lottery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_lottery_entries_updated_at
BEFORE UPDATE ON public.lottery_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_lottery_updated_at();

CREATE TRIGGER update_lottery_subscriptions_updated_at
BEFORE UPDATE ON public.lottery_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_lottery_updated_at();