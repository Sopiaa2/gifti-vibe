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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          emoji: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          emoji: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          emoji?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      gifticons: {
        Row: {
          brand: string
          brand_logo_url: string | null
          category_slug: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          prev_rank_bad: number | null
          prev_rank_want: number | null
          price: number
          product_image_url: string | null
          trend_badge: string | null
          updated_at: string
          vote_count_bad: number
          vote_count_want: number
        }
        Insert: {
          brand: string
          brand_logo_url?: string | null
          category_slug: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          prev_rank_bad?: number | null
          prev_rank_want?: number | null
          price: number
          product_image_url?: string | null
          trend_badge?: string | null
          updated_at?: string
          vote_count_bad?: number
          vote_count_want?: number
        }
        Update: {
          brand?: string
          brand_logo_url?: string | null
          category_slug?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          prev_rank_bad?: number | null
          prev_rank_want?: number | null
          price?: number
          product_image_url?: string | null
          trend_badge?: string | null
          updated_at?: string
          vote_count_bad?: number
          vote_count_want?: number
        }
        Relationships: [
          {
            foreignKeyName: "gifticons_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      suggestions: {
        Row: {
          brand: string
          created_at: string
          id: string
          name: string
          price_range: string
          session_id: string
          vote_count: number
        }
        Insert: {
          brand: string
          created_at?: string
          id?: string
          name: string
          price_range: string
          session_id: string
          vote_count?: number
        }
        Update: {
          brand?: string
          created_at?: string
          id?: string
          name?: string
          price_range?: string
          session_id?: string
          vote_count?: number
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          daily_votes_limit: number
          daily_votes_used: number
          is_open_event: boolean
          last_vote_date: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          daily_votes_limit?: number
          daily_votes_used?: number
          is_open_event?: boolean
          last_vote_date?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          daily_votes_limit?: number
          daily_votes_used?: number
          is_open_event?: boolean
          last_vote_date?: string | null
          session_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          gifticon_id: string
          id: string
          session_id: string
          vote_type: string
          voted_at: string
        }
        Insert: {
          gifticon_id: string
          id?: string
          session_id: string
          vote_type: string
          voted_at?: string
        }
        Update: {
          gifticon_id?: string
          id?: string
          session_id?: string
          vote_type?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_gifticon_id_fkey"
            columns: ["gifticon_id"]
            isOneToOne: false
            referencedRelation: "gifticons"
            referencedColumns: ["id"]
          },
        ]
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
