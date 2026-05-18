import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://pbnoixeqmtiinclkvfiz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibm9peGVxbXRpaW5jbGt2Zml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjgxMzQsImV4cCI6MjA5NDY0NDEzNH0.d7q_CRzVea_tou4o2BXDqqkDrPZpK2gxyJtaEr1luyI',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
