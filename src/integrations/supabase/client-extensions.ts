
import { supabase as originalSupabase } from "./client";

// Extend the Supabase client with a rest property for handling tables not in the current types
interface RestMethods {
  from: (table: string) => {
    select: (query?: string) => Promise<{ data: any; error: any }>;
    insert: (values: any, options?: any) => Promise<{ data: any; error: any }>;
    update: (values: any, options?: any) => Promise<{ data: any; error: any }>;
    delete: () => Promise<{ data: any; error: any }>;
    eq: (column: string, value: any) => any;
    order: (column: string, options?: { ascending?: boolean }) => any;
    single: () => Promise<{ data: any; error: any }>;
  };
}

// Cast the original client to an extended type that includes our rest methods
const supabase = originalSupabase as typeof originalSupabase & { rest: RestMethods };

// Add the rest property that mimics the from() method but makes TypeScript happy
supabase.rest = {
  from: (table) => {
    const query = originalSupabase.from(table as any);
    return query as any;
  }
};

export { supabase };
