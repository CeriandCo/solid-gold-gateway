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
      aurum_admin_login_attempts: {
        Row: {
          created_at: string
          email_hash: string
          id: number
          ip_hash: string
          succeeded: boolean
        }
        Insert: {
          created_at?: string
          email_hash: string
          id?: number
          ip_hash: string
          succeeded?: boolean
        }
        Update: {
          created_at?: string
          email_hash?: string
          id?: number
          ip_hash?: string
          succeeded?: boolean
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
      checkout_attempts: {
        Row: {
          created_at: string
          id: number
          ip_hash: string
          kind: string
        }
        Insert: {
          created_at?: string
          id?: number
          ip_hash: string
          kind?: string
        }
        Update: {
          created_at?: string
          id?: number
          ip_hash?: string
          kind?: string
        }
        Relationships: []
      }
      commerce_alerts: {
        Row: {
          created_at: string
          gift_card_id: string | null
          id: string
          kind: string
          message: string
          order_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          created_at?: string
          gift_card_id?: string | null
          id?: string
          kind: string
          message: string
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
        }
        Update: {
          created_at?: string
          gift_card_id?: string | null
          id?: string
          kind?: string
          message?: string
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "commerce_alerts_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commerce_alerts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "gift_card_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      commerce_settings: {
        Row: {
          allowed_origins: string[]
          checkout_enabled: boolean
          currency: string | null
          daily_limit_cents: number
          delivery_enabled: boolean
          email_from: string | null
          hold_hours: number
          id: boolean
          max_card_cents: number
          review_threshold_cents: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allowed_origins?: string[]
          checkout_enabled?: boolean
          currency?: string | null
          daily_limit_cents?: number
          delivery_enabled?: boolean
          email_from?: string | null
          hold_hours?: number
          id?: boolean
          max_card_cents?: number
          review_threshold_cents?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allowed_origins?: string[]
          checkout_enabled?: boolean
          currency?: string | null
          daily_limit_cents?: number
          delivery_enabled?: boolean
          email_from?: string | null
          hold_hours?: number
          id?: boolean
          max_card_cents?: number
          review_threshold_cents?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      gift_card_delivery_attempts: {
        Row: {
          attempted_at: string
          error_category: string | null
          gift_card_id: string
          id: number
          outcome: string
          provider_message_id: string | null
        }
        Insert: {
          attempted_at?: string
          error_category?: string | null
          gift_card_id: string
          id?: number
          outcome: string
          provider_message_id?: string | null
        }
        Update: {
          attempted_at?: string
          error_category?: string | null
          gift_card_id?: string
          id?: number
          outcome?: string
          provider_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_delivery_attempts_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_card_denominations: {
        Row: {
          active: boolean
          amount_cents: number
          created_at: string
          id: string
          sort_order: number
          stripe_price_id_live: string | null
          stripe_price_id_test: string | null
        }
        Insert: {
          active?: boolean
          amount_cents: number
          created_at?: string
          id?: string
          sort_order?: number
          stripe_price_id_live?: string | null
          stripe_price_id_test?: string | null
        }
        Update: {
          active?: boolean
          amount_cents?: number
          created_at?: string
          id?: string
          sort_order?: number
          stripe_price_id_live?: string | null
          stripe_price_id_test?: string | null
        }
        Relationships: []
      }
      gift_card_ledger: {
        Row: {
          actor: string
          amount_cents: number
          balance_after: number
          created_at: string
          entry_type: string
          gift_card_id: string
          id: number
          reference: string | null
        }
        Insert: {
          actor: string
          amount_cents?: number
          balance_after: number
          created_at?: string
          entry_type: string
          gift_card_id: string
          id?: number
          reference?: string | null
        }
        Update: {
          actor?: string
          amount_cents?: number
          balance_after?: number
          created_at?: string
          entry_type?: string
          gift_card_id?: string
          id?: number
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_ledger_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_card_orders: {
        Row: {
          amount_cents: number
          attempt_id: string | null
          buyer_email: string | null
          card_fingerprint_hash: string | null
          client_ip_hash: string | null
          created_at: string
          currency: string
          denomination_id: string | null
          gift_message: string | null
          id: string
          livemode: boolean | null
          paid_at: string | null
          recipient_email: string | null
          recipient_name: string | null
          review_reasons: string[]
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          attempt_id?: string | null
          buyer_email?: string | null
          card_fingerprint_hash?: string | null
          client_ip_hash?: string | null
          created_at?: string
          currency: string
          denomination_id?: string | null
          gift_message?: string | null
          id?: string
          livemode?: boolean | null
          paid_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          review_reasons?: string[]
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          attempt_id?: string | null
          buyer_email?: string | null
          card_fingerprint_hash?: string | null
          client_ip_hash?: string | null
          created_at?: string
          currency?: string
          denomination_id?: string | null
          gift_message?: string | null
          id?: string
          livemode?: boolean | null
          paid_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          review_reasons?: string[]
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_orders_denomination_id_fkey"
            columns: ["denomination_id"]
            isOneToOne: false
            referencedRelation: "gift_card_denominations"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          activated_at: string | null
          amount_cents: number
          balance_cents: number
          code_hash: string | null
          code_last4: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          delivery_claimed_at: string | null
          hold_until: string | null
          id: string
          order_id: string
          status: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          amount_cents: number
          balance_cents: number
          code_hash?: string | null
          code_last4?: string | null
          created_at?: string
          currency: string
          delivered_at?: string | null
          delivery_claimed_at?: string | null
          hold_until?: string | null
          id?: string
          order_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          amount_cents?: number
          balance_cents?: number
          code_hash?: string | null
          code_last4?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_claimed_at?: string | null
          hold_until?: string | null
          id?: string
          order_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "gift_card_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          error: string | null
          event_id: string
          livemode: boolean | null
          processed_at: string | null
          received_at: string
          status: string
          type: string | null
        }
        Insert: {
          error?: string | null
          event_id: string
          livemode?: boolean | null
          processed_at?: string | null
          received_at?: string
          status?: string
          type?: string | null
        }
        Update: {
          error?: string | null
          event_id?: string
          livemode?: boolean | null
          processed_at?: string | null
          received_at?: string
          status?: string
          type?: string | null
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
      aurum_can_edit_post_sources: {
        Args: { _post_id: string }
        Returns: boolean
      }
      aurum_current_editor_role: { Args: never; Returns: string }
      aurum_fetcher_tick: { Args: never; Returns: undefined }
      aurum_link_current_editor: { Args: never; Returns: string }
      aurum_prune_admin_login_attempts: { Args: never; Returns: undefined }
      aurum_prune_old_rows: { Args: never; Returns: undefined }
      aurum_replace_post_sources: {
        Args: { _post_id: string; _sources: Json }
        Returns: undefined
      }
      commerce_delivery_tick: { Args: never; Returns: undefined }
      commerce_prune_checkout_attempts: { Args: never; Returns: undefined }
      commerce_prune_delivery_attempts: { Args: never; Returns: undefined }
      commerce_purge_test_order: {
        Args: { _order_id: string }
        Returns: boolean
      }
      gift_card_activate_due: { Args: never; Returns: number }
      gift_card_claim_for_delivery: {
        Args: { _lease_minutes?: number; _limit?: number }
        Returns: {
          amount_cents: number
          currency: string
          gift_card_id: string
          gift_message: string
          order_id: string
          recipient_email: string
          recipient_name: string
        }[]
      }
      gift_card_order_settle: {
        Args: {
          _buyer_email?: string
          _card_fingerprint_hash?: string
          _event_id: string
          _gift_message?: string
          _order_id: string
          _payment_intent_id?: string
          _recipient_email?: string
          _recipient_name?: string
          _review_reasons?: string[]
          _three_ds_ok?: boolean
        }
        Returns: Json
      }
      gift_card_record: {
        Args: {
          _actor: string
          _amount_cents?: number
          _entry_type: string
          _gift_card_id: string
          _new_status?: string
          _reference?: string
        }
        Returns: number
      }
      gift_card_release_delivery_claim: {
        Args: { _gift_card_id: string }
        Returns: undefined
      }
      gift_card_set_code: {
        Args: { _code_hash: string; _code_last4: string; _gift_card_id: string }
        Returns: boolean
      }
      gift_card_set_stripe_prices: {
        Args: { _map: Json; _mode: string }
        Returns: number
      }
      security_function_grants: {
        Args: never
        Returns: {
          anon_execute: boolean
          arguments: string
          authenticated_execute: boolean
          function_name: string
          security_definer: boolean
          service_role_execute: boolean
        }[]
      }
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
