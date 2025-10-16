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
      lottery_draws: {
        Row: {
          created_at: string
          draw_date: string
          id: string
          is_test_draw: boolean
          jackpot_amount: number | null
          lucky_dip_amount: number | null
          random_org_signature: string | null
          winning_numbers: number[]
        }
        Insert: {
          created_at?: string
          draw_date: string
          id?: string
          is_test_draw?: boolean
          jackpot_amount?: number | null
          lucky_dip_amount?: number | null
          random_org_signature?: string | null
          winning_numbers: number[]
        }
        Update: {
          created_at?: string
          draw_date?: string
          id?: string
          is_test_draw?: boolean
          jackpot_amount?: number | null
          lucky_dip_amount?: number | null
          random_org_signature?: string | null
          winning_numbers?: number[]
        }
        Relationships: []
      }
      lottery_entries: {
        Row: {
          created_at: string
          draw_date: string
          id: string
          is_active: boolean
          line_number: number
          numbers: number[]
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          draw_date: string
          id?: string
          is_active?: boolean
          line_number?: number
          numbers: number[]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          draw_date?: string
          id?: string
          is_active?: boolean
          line_number?: number
          numbers?: number[]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lottery_promo_codes: {
        Row: {
          code_name: string
          created_at: string
          discount_percentage: number
          expires_at: string | null
          id: string
          is_active: boolean
          reason: string
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          code_name: string
          created_at?: string
          discount_percentage: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          code_name?: string
          created_at?: string
          discount_percentage?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      lottery_results: {
        Row: {
          created_at: string
          draw_id: string
          entry_id: string
          id: string
          is_winner: boolean
          matches: number
          prize_amount: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          draw_id: string
          entry_id: string
          id?: string
          is_winner?: boolean
          matches?: number
          prize_amount?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          draw_id?: string
          entry_id?: string
          id?: string
          is_winner?: boolean
          matches?: number
          prize_amount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_results_draw_id_fkey"
            columns: ["draw_id"]
            isOneToOne: false
            referencedRelation: "lottery_draws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_results_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "lottery_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      lottery_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      lottery_subscriptions: {
        Row: {
          created_at: string
          id: string
          lines_count: number
          next_draw_date: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lines_count?: number
          next_draw_date?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lines_count?: number
          next_draw_date?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
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
      player_sponsors: {
        Row: {
          created_at: string
          display_order: number
          id: string
          player_id: string
          sponsor_logo_url: string | null
          sponsor_name: string
          sponsor_website: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          player_id: string
          sponsor_logo_url?: string | null
          sponsor_name: string
          sponsor_website?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          player_id?: string
          sponsor_logo_url?: string | null
          sponsor_name?: string
          sponsor_website?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_sponsors_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
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
          sponsor_website: string | null
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
          sponsor_website?: string | null
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
          sponsor_website?: string | null
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
      site_content: {
        Row: {
          content_type: string
          content_value: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_positioned: boolean | null
          is_published: boolean | null
          page: string
          position_height: number | null
          position_width: number | null
          position_x: number | null
          position_y: number | null
          position_z_index: number | null
          published_value: string | null
          section_key: string
          section_label: string
          updated_at: string | null
        }
        Insert: {
          content_type: string
          content_value?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_positioned?: boolean | null
          is_published?: boolean | null
          page: string
          position_height?: number | null
          position_width?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z_index?: number | null
          published_value?: string | null
          section_key: string
          section_label: string
          updated_at?: string | null
        }
        Update: {
          content_type?: string
          content_value?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_positioned?: boolean | null
          is_published?: boolean | null
          page?: string
          position_height?: number | null
          position_width?: number | null
          position_x?: number | null
          position_y?: number | null
          position_z_index?: number | null
          published_value?: string | null
          section_key?: string
          section_label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          page_key: string
          page_path: string
          page_title: string
          template: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          page_key: string
          page_path: string
          page_title: string
          template?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          page_key?: string
          page_path?: string
          page_title?: string
          template?: string
          updated_at?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_first_admin: {
        Args: { _user_email: string }
        Returns: boolean
      }
      create_first_website_overlord: {
        Args: { _user_email: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_promo_usage: {
        Args: { promo_name: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_lottery_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_website_overlord: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      promote_to_admin: {
        Args: { _user_email: string }
        Returns: boolean
      }
      promote_user: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_email: string
        }
        Returns: boolean
      }
      trigger_automatic_draw: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "website_overlord" | "admin" | "user" | "lottery_admin"
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
    Enums: {
      app_role: ["website_overlord", "admin", "user", "lottery_admin"],
    },
  },
} as const
