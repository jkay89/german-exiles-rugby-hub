
import { supabase as originalSupabase } from "./client";

// Create a clearer type for the rest client to fix TypeScript errors
interface GenericSupabaseClient {
  from: (table: string) => any;
}

// Export the client with added rest property for non-typed tables
export const supabase = {
  ...originalSupabase,
  // Direct access to storage with no wrapping to ensure maximum compatibility
  storage: originalSupabase.storage,
  // Add rest property for accessing tables not in the types
  rest: {
    from: (table: string) => (originalSupabase as any).from(table)
  } as GenericSupabaseClient,
  // Pass through auth capabilities
  auth: originalSupabase.auth,
  // Pass through realtime capabilities
  realtime: originalSupabase.realtime
};
