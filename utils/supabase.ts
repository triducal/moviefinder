import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://trwyrsdscgsjwbrngfoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd3lyc2RzY2dzandicm5nZm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjg5MjcsImV4cCI6MjA3MzcwNDkyN30.h-ghLIgTMFEjd1mrOZpfaTEcoHVPQznfApOLK03CwVY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
