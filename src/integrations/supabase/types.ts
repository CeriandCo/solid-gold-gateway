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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aurum_admin_link_requests: {
        Row: {
          email: string
          last_requested_at: string
        }
        Insert: {
          email: string
          last_requested_at?: string
        }
        Update: {
          email?: string
          last_requested_at?: string
        }
        Relationships: []
      }
      aurum_cms_settings: {
        Row: {
          allow_self_approval: boolean
          id: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allow_self_approval?: boolean
          id?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allow_self_approval?: boolean
          id?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      aurum_daily_closes: {
        Row: {
          close_price: number
          created_at: string
          currency: string
          id: string
          price_date: string
          source: string | null
          unit: string
        }
        Insert: {
          close_price: number
          created_at?: string
          currency: string
          id?: string
          price_date: string
          source?: string | null
          unit: string
        }
        Update: {
          close_price?: number
          created_at?: string
          currency?: string
          id?: string
          price_date?: string
          source?: string | null
          unit?: string
        }
        Relationships: []
      }
      aurum_editors: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      aurum_fetcher_runs: {
        Row: {
          detail: string | null
          id: number
          outcome: string | null
          request_id: number | null
          requested_at: string
          status_code: number | null
        }
        Insert: {
          detail?: string | null
          id?: number
          outcome?: string | null
          request_id?: number | null
          requested_at?: string
          status_code?: number | null
        }
        Update: {
          detail?: string | null
          id?: number
          outcome?: string | null
          request_id?: number | null
          requested_at?: string
          status_code?: number | null
        }
        Relationships: []
      }
      aurum_post_sources: {
        Row: {
          id: string
          position: number
          post_id: string
          publisher: string
          source_date: string
          title: string
          url: string
        }
        Insert: {
          id?: string
          position: number
          post_id: string
          publisher: string
          source_date: string
          title: string
          url: string
        }
        Update: {
          id?: string
          position?: number
          post_id?: string
          publisher?: string
          source_date?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "aurum_post_sources_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "aurum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      aurum_posts: {
        Row: {
          author_id: string | null
          body: Json
          created_at: string
          id: string
          published_at: string | null
          pull_quote: string | null
          read_minutes: number | null
          review_line: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          status: string
          submitted_at: string | null
          summary: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: Json
          created_at?: string
          id?: string
          published_at?: string | null
          pull_quote?: string | null
          read_minutes?: number | null
          review_line?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          status?: string
          submitted_at?: string | null
          summary: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: Json
          created_at?: string
          id?: string
          published_at?: string | null
          pull_quote?: string | null
          read_minutes?: number | null
          review_line?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          status?: string
          submitted_at?: string | null
          summary?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      aurum_spot_prices: {
        Row: {
          change_amount: number
          change_percent: number
          created_at: string
          currency: string
          high_24h: number
          id: string
          low_24h: number
          observed_at: string
          previous_close: number | null
          price: number
          source: string | null
          unit: string
        }
        Insert: {
          change_amount: number
          change_percent: number
          created_at?: string
          currency: string
          high_24h: number
          id?: string
          low_24h: number
          observed_at: string
          previous_close?: number | null
          price: number
          source?: string | null
          unit: string
        }
        Update: {
          change_amount?: number
          change_percent?: number
          created_at?: string
          currency?: string
          high_24h?: number
          id?: string
          low_24h?: number
          observed_at?: string
          previous_close?: number | null
          price?: number
          source?: string | null
          unit?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aurum_backfill_tick: { Args: never; Returns: undefined }
      aurum_can_edit_draft: { Args: { _author_id: string }; Returns: boolean }
      aurum_current_editor_role: { Args: never; Returns: string }
      aurum_fetcher_tick: { Args: never; Returns: undefined }
      aurum_link_current_editor: { Args: never; Returns: string }
      aurum_prune_old_rows: { Args: never; Returns: undefined }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
