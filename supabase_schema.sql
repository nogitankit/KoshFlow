-- SQL script to create the transactions table in Supabase
-- Run this in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/veumodvuejntidfoodnx/sql/new)

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  channel TEXT NOT NULL DEFAULT 'online',
  category TEXT NOT NULL DEFAULT 'Transfer',
  "senderId" TEXT NOT NULL,
  "senderBankId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "receiverBankId" TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view transactions where they are either the sender or receiver
CREATE POLICY "Users can view their own transactions" 
ON public.transactions
FOR SELECT 
TO authenticated
USING (
  auth.uid()::text = "senderId" OR auth.uid()::text = "receiverId"
);

-- Allow users to create transactions where they are the sender
CREATE POLICY "Users can create transactions" 
ON public.transactions
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid()::text = "senderId"
);
