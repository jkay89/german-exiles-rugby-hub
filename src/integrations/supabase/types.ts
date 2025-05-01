export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
