export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      coaching_staff: {
        Row: {
          bio: string | null
          contact_email: string | null
          contact_number: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      committee_members: {
        Row: {
          contact_email: string | null
          contact_number: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_type: string
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_type: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          competition: string
          created_at: string
          date: string
          id: string
          is_home: boolean
          location: string
          opponent: string
          team: string
          time: string
          updated_at: string
        }
        Insert: {
          competition: string
          created_at?: string
          date: string
          id?: string
          is_home?: boolean
          location: string
          opponent: string
          team: string
          time: string
          updated_at?: string
        }
        Update: {
          competition?: string
          created_at?: string
          date?: string
          id?: string
          is_home?: boolean
          location?: string
          opponent?: string
          team?: string
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_folders: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      media_items: {
        Row: {
          created_at: string
          folder_id: string
          id: string
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          folder_id: string
          id?: string
          title?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string
          folder_id?: string
          id?: string
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          created_at: string
          games_played: number
          id: string
          man_of_the_match: number
          name: string
          photo_url: string | null
          player_id: string
          points_scored: number
          position: string | null
          red_cards: number
          trys_scored: number
          updated_at: string
          yellow_cards: number
        }
        Insert: {
          created_at?: string
          games_played?: number
          id?: string
          man_of_the_match?: number
          name: string
          photo_url?: string | null
          player_id: string
          points_scored?: number
          position?: string | null
          red_cards?: number
          trys_scored?: number
          updated_at?: string
          yellow_cards?: number
        }
        Update: {
          created_at?: string
          games_played?: number
          id?: string
          man_of_the_match?: number
          name?: string
          photo_url?: string | null
          player_id?: string
          points_scored?: number
          position?: string | null
          red_cards?: number
          trys_scored?: number
          updated_at?: string
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          bio: string | null
          club: string | null
          created_at: string
          heritage: string | null
          id: string
          name: string
          national_number: string | null
          number: number | null
          photo_url: string | null
          position: string | null
          sponsor_logo_url: string | null
          sponsor_name: string | null
          team: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          club?: string | null
          created_at?: string
          heritage?: string | null
          id?: string
          name: string
          national_number?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          team: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          club?: string | null
          created_at?: string
          heritage?: string | null
          id?: string
          name?: string
          national_number?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          competition: string
          created_at: string
          date: string
          fixture_id: string | null
          id: string
          is_home: boolean
          motm: string | null
          opponent: string
          opponent_score: number
          team: string
          team_score: number
          updated_at: string
        }
        Insert: {
          competition: string
          created_at?: string
          date: string
          fixture_id?: string | null
          id?: string
          is_home?: boolean
          motm?: string | null
          opponent: string
          opponent_score: number
          team: string
          team_score: number
          updated_at?: string
        }
        Update: {
          competition?: string
          created_at?: string
          date?: string
          fixture_id?: string | null
          id?: string
          is_home?: boolean
          motm?: string | null
          opponent?: string
          opponent_score?: number
          team?: string
          team_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          tier: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          tier: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          tier?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      team_sponsors: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          sponsor_logo_url: string | null
          sponsor_name: string
          sponsor_website: string | null
          team: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          sponsor_logo_url?: string | null
          sponsor_name: string
          sponsor_website?: string | null
          team: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          sponsor_logo_url?: string | null
          sponsor_name?: string
          sponsor_website?: string | null
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
