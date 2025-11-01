import { createClient } from '@supabase/supabase-js'

// !! IMPORTANT !!
// 1. Go to your Supabase project settings > API.
// 2. Find your "Project URL" and paste it here.
const supabaseUrl = 'https://jdvnpkifmbwibrohhkkh.supabase.co';

// 3. Find your "Project API Keys" and paste the "anon" "public" key here.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkdm5wa2lmbWJ3aWJyb2hoa2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjIxNzYsImV4cCI6MjA3NzU5ODE3Nn0.TaMQA-UaHNyW88qS9Oc8ASt1oz4c1NvZprp-hgJJ1FA';

// 4. Make sure you have created the 'applications' table and the 'portfolios' storage bucket as per the instructions.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

