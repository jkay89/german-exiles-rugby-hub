
import { supabase as originalSupabase } from "./client";

// Define a simplified interface for the REST methods that work with tables not in the current types
interface RestMethods {
  from: (table: string) => {
    select: (query?: string) => {
      eq: (column: string, value: any) => {
        order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: any; error: any }>;
        single: () => Promise<{ data: any; error: any }>;
      };
      order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: any; error: any }>;
      single: () => Promise<{ data: any; error: any }>;
    };
    insert: (values: any, options?: any) => {
      select: () => Promise<{ data: any; error: any }>;
    };
    update: (values: any, options?: any) => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
    };
    delete: () => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
    };
    eq: (column: string, value: any) => {
      order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: any; error: any }>;
    };
  };
}

// Create a type that includes our original client plus the rest property
type ExtendedSupabaseClient = typeof originalSupabase & {
  rest: RestMethods;
};

// Cast the original client to include our rest property
const supabase = originalSupabase as ExtendedSupabaseClient;

// Implement the rest property with methods that proxy to the original client
supabase.rest = {
  from: (table: string) => {
    return {
      select: (selectQuery?: string) => {
        return {
          eq: (column: string, value: any) => {
            return {
              order: (orderColumn: string, options?: { ascending?: boolean }) => {
                return originalSupabase
                  .from(table)
                  .select(selectQuery)
                  .eq(column, value)
                  .order(orderColumn, options);
              },
              single: () => {
                return originalSupabase
                  .from(table)
                  .select(selectQuery)
                  .eq(column, value)
                  .single();
              }
            };
          },
          order: (column: string, options?: { ascending?: boolean }) => {
            return originalSupabase
              .from(table)
              .select(selectQuery)
              .order(column, options);
          },
          single: () => {
            return originalSupabase
              .from(table)
              .select(selectQuery)
              .single();
          }
        };
      },
      insert: (values: any, options?: any) => {
        return {
          select: () => {
            return originalSupabase
              .from(table)
              .insert(values, options)
              .select();
          }
        };
      },
      update: (values: any, options?: any) => {
        return {
          eq: (column: string, value: any) => {
            return originalSupabase
              .from(table)
              .update(values, options)
              .eq(column, value);
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return originalSupabase
              .from(table)
              .delete()
              .eq(column, value);
          }
        };
      },
      eq: (column: string, value: any) => {
        return {
          order: (orderColumn: string, options?: { ascending?: boolean }) => {
            return originalSupabase
              .from(table)
              .eq(column, value)
              .order(orderColumn, options);
          }
        };
      }
    };
  }
};

export { supabase };
