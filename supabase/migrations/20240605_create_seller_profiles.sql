-- Create seller_profiles table
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  commission_rate NUMERIC DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to seller profiles
CREATE POLICY "Allow public read access to seller profiles"
  ON public.seller_profiles FOR SELECT
  USING (true);

-- Policy: Allow users to update their own seller profile
CREATE POLICY "Allow users to update their own seller profile"
  ON public.seller_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow users to insert their own seller profile
CREATE POLICY "Allow users to insert their own seller profile"
  ON public.seller_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create index on store_slug for faster lookups
CREATE INDEX idx_seller_profiles_store_slug ON public.seller_profiles(store_slug);

-- Create index on verified for filtering verified sellers
CREATE INDEX idx_seller_profiles_verified ON public.seller_profiles(verified);
