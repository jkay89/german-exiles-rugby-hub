
import { createClient } from '@supabase/supabase-js';
import { supabase as originalSupabase } from "./client";

// Create a separate client instance specifically for non-typed tables
// Using Vite's import.meta.env instead of process.env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hmjwfnsygwzijjgrygia.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo";

// Create a direct client without type definitions for generic tables
const genericClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Create a clearer type for the rest client to fix TypeScript errors
interface GenericSupabaseClient {
  from: (table: string) => any;
}

// Export the client with added rest property for non-typed tables
export const supabase = {
  ...originalSupabase,
  // Direct access to storage with no wrapping to ensure maximum compatibility
  storage: genericClient.storage,
  // Add rest property for accessing tables not in the types
  rest: {
    from: (table: string) => genericClient.from(table)
  } as GenericSupabaseClient,
  // Pass through auth capabilities
  auth: genericClient.auth,
  // Pass through realtime capabilities
  realtime: genericClient.realtime
};
