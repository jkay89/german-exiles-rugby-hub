
import { supabase as originalSupabase } from "./client";

// Define the structure for the REST methods that work with tables not in the current types
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

// Create an extended type for the Supabase client
type ExtendedSupabaseClient = typeof originalSupabase & {
  rest: RestMethods;
};

// Cast the original client to our extended type
const supabase = originalSupabase as ExtendedSupabaseClient;

// Add the rest property that proxies requests to the original client's from() method
supabase.rest = {
  from: (table: string) => {
    // Use the original from() method but return a more strictly typed object
    const query = originalSupabase.from(table as any);
    return {
      select: (selectQuery?: string) => {
        const selectResult = query.select(selectQuery as any);
        return {
          eq: (column: string, value: any) => {
            const eqResult = selectResult.eq(column as any, value);
            return {
              order: (orderColumn: string, options?: { ascending?: boolean }) => 
                eqResult.order(orderColumn as any, options),
              single: () => eqResult.single()
            };
          },
          order: (column: string, options?: { ascending?: boolean }) => 
            selectResult.order(column as any, options),
          single: () => selectResult.single()
        };
      },
      insert: (values: any, options?: any) => {
        const insertResult = query.insert(values, options);
        return {
          select: () => insertResult.select()
        };
      },
      update: (values: any, options?: any) => {
        const updateResult = query.update(values, options);
        return {
          eq: (column: string, value: any) => updateResult.eq(column as any, value)
        };
      },
      delete: () => {
        const deleteResult = query.delete();
        return {
          eq: (column: string, value: any) => deleteResult.eq(column as any, value)
        };
      },
      eq: (column: string, value: any) => {
        const eqResult = query.eq(column as any, value);
        return {
          order: (orderColumn: string, options?: { ascending?: boolean }) => 
            eqResult.order(orderColumn as any, options)
        };
      }
    };
  }
};

export { supabase };
